/**
 * @description: lookup data service to handler stuff such as, load data, get data list, get default item,
 * get item by key value and get search list.
 */

(function (angular, globals) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	const LAST_LEGACY_LOOKUP_TYPE_VERSION_NUMBER = 2;

	angular.module(moduleName).factory('basicsLookupdataLookupDataService', [
		'_', '$q',
		'globals',
		'$http',
		'$injector',
		'platformObjectHelper',
		'platformContextService',
		'BasicsLookupdataLookupDictionary',
		'basicsLookupdataLookupDefinitionService',
		'cloudCommonGridService',
		'$translate',
		'basicsLookupdataLookupFilterService',
		function (_, $q,
			globals,
			$http,
			$injector,
			platformObjectHelper,
			platformContextService,
			LookupDictionary,
			lookupDefinitionService,
			cloudCommonGridService,
			$translate,
			lookupFilterService) {

			var dataProviders = new LookupDictionary(true), lookupProvider = null;

			/**
			 * @description: LookupDataProvider constructor function.
			 * @arguments:
			 *  type: lookup type.
			 *  url: an url object, this is an option.
			 */
			function LookupDataProvider(type, url) {
				this.type = type.toLowerCase();
				this.url = url;
				this.identifier = 'default';
				this.cache = {
					active: false,
					content: {},
					data: []
				};
				this.entityCache = new Map();
				this.isFastDataRecording = true;
			}

			/**
			 * get http url
			 * @param action
			 * @param options
			 * @returns {*}
			 */
			LookupDataProvider.prototype.getHttpUrl = function (action, options) {
				var base;

				if (this.url && this.url[action]) {
					return this.url[action];
				}

				// todo-wui: new lookup master api
				var version = this.getVersion(options);
				if (version > 2) {
					base = 'basics/lookupdata/masternew/';
				}
				else {
					base = 'basics/lookupdata/master/';
				}

				return base + action.toLowerCase() + '?lookup=' + this.type;
			};

			/**
			 * do get http response.
			 * @param method
			 * @param url
			 * @param options
			 * @returns {Promise}
			 */
			LookupDataProvider.prototype.sendHttp = function (method, url, options) {
				var self = this,
					cid = url,
					deferred = $q.defer();

				options = options || {};

				if (method === 'post' && options.data) {
					cid += '&args=' + _.isObject(options.data) ? JSON.stringify(options.data) : options.data;
				}

				function success(response) {
					if (self.cache.active) {
						if (self.cache.content[cid] !== response) {
							self.cache.content[cid] = response;
						}
					}
					else {
						self.cache.content[cid] = null;
					}

					var data = response.data;

					if (options.map) {
						data = options.map(data);
					}

					deferred.resolve(data);
				}

				function error(error) {
					self.cache.content[cid] = null;
					deferred.reject(error);
				}

				if (!self.cache.content[cid]) {
					self.cache.content[cid] = $http[method](globals.webApiBaseUrl + url, options.data);
				}

				$q.when(self.cache.content[cid]).then(success, error);

				return deferred.promise;
			};

			/**
			 * get list
			 * @param options
			 * @returns {Promise}
			 */
			LookupDataProvider.prototype.getList = function (options) {
				return this.sendHttp('get', this.getHttpUrl('getList', options));
			};

			/**
			 * get default
			 * @param options
			 * @returns {Promise}
			 */
			LookupDataProvider.prototype.getDefault = function (options) {
				return this.sendHttp('get', this.getHttpUrl('getDefault', options));
			};

			/**
			 * get item by key
			 * @param key
			 * @param options
			 * @returns {Promise}
			 */
			LookupDataProvider.prototype.getItemByKey = function (key, options) {
				if (key < 0 || _.isNil(key) || (_.isObject(key) && _.isEmpty(key))) { // 0 is a valid edit value !
					return $q.when({});
				}

				options = options || {};

				var url = this.getHttpUrl('getItemByKey', options);

				var idProperty = options.idProperty ? options.idProperty : options.url && options.url.idProperty ? options.url.idProperty : 'id',
					result = _.find(this.cache.data, key);

				if (result) {
					return $q.when(result);
				}

				// todo-wui: new lookup master api
				var version = this.getVersion(options);
				if (version > 2) {
					return this.sendHttp('post', url, {
						data: angular.isObject(key) ? key : {id: key}
					});
				}

				if (angular.isObject(key)) {
					key = key.Id;
				}

				if (url.indexOf('?') === -1) {
					url = url + '?' + idProperty + '=' + key;
				}
				else {
					url = url + '&' + idProperty + '=' + key;
				}

				return this.sendHttp('get', url);
			};

			/**
			 * get search list
			 * @param request
			 * @param options
			 * @returns {Promise}
			 */
			LookupDataProvider.prototype.getSearchList = function (request, options) {
				// todo-wui: using new lookup master api if it is an object
				if (angular.isObject(request)) {
					options = options || {};
					options.version = 3;
					if (!request.TreeState) {
						request.TreeState = {
							StartId: null,
							Depth: null
						};
					}
				}

				var url = this.getHttpUrl('getSearchList', options);

				// todo-wui: new lookup master api
				var version = this.getVersion(options);
				if (version > 2) {
					// var dataStr = request;
					// if (angular.isObject(request)) {
					// 	dataStr = '\'' + JSON.stringify(request) + '\'';
					// } else {
					// 	dataStr = JSON.stringify(request);
					// }
					return this.sendHttp('post', url, {
						data: _.isObject(request) ? JSON.stringify(request) : request,
						map: function (data) {
							if (_.isNil(data)) {
								return {};
							}

							if(!_.isNil(data.Log)){
								console.log(data.Log);
							}

							return {
								items: data.SearchList,
								itemsFound: data.RecordsFound,
								itemsRetrieved: data.RecordsRetrieved
							};
						}
					});
				}

				if (url.indexOf('?') === -1) {
					url = url + '?filtervalue=' + encodeURIComponent(request);
				}
				else {
					url = url + '&filtervalue=' + encodeURIComponent(request);
				}

				return this.sendHttp('get', url);
			};

			/**
			 * set data provider state.
			 * @param state
			 */
			LookupDataProvider.prototype.state = function (state) {
				this.cache.active = state.cache;
				if (!state) {
					this.clear();
				}
			};

			/**
			 * clear http response cache
			 */
			LookupDataProvider.prototype.clear = function () {
				this.cache.content = {};
				this.entityCache.clear();
			};

			/**
			 * gets version.
			 * @param options
			 * @returns {number}
			 */
			LookupDataProvider.prototype.getVersion = function (options) {
				if (!angular.isDefined(options)) {
					options = {};
				}
				var version = options.version;
				if (!angular.isDefined(version)) {
					var lookupType = ((options && options.lookupType) ? options.lookupType : this.type).toLowerCase();
					if (lookupType) {
						var lookup = lookupDefinitionService.get(lookupType);
						if (lookup && lookup.version) {
							version = lookup.version;
						} else {
							var providerInfo = getProviderInfo(lookupType), lookupOptions = providerInfo ? providerInfo.lookupOptions : null;
							version = (lookupOptions && lookupOptions.version) ? lookupOptions.version : version;
						}
					}
				}
				return version;
			};

			LookupDataProvider.prototype.getFilterParam = function(filter, item) {
				if (!filter?.serverSide) {
					return {};
				}

				return {
					FilterKey: filter.serverKey,
					AdditionalParameters: filter.fn(item),
				}
			};

			LookupDataProvider.prototype.getFilterString = function(filter, item) {
				if (!filter?.serverSide) {
					return '';
				}

				return filter.fn(item);
			};

			LookupDataProvider.prototype.getFilter = function(formatterOptions, lookupConfig) {
				const filterOptions = _.get(lookupConfig, 'filterOptions', null);

				if (filterOptions) {
					return filterOptions;
				}

				const filterKey = formatterOptions.filterKey ?? lookupConfig.filterKey;

				if (!filterKey) {
					return;
				}

				return lookupFilterService.getFilterByKey(filterKey);
			};

			/**
			 * Used in grid fast input for resolving foreign key from user input string
			 * @param value
			 * @param options
			 */
			LookupDataProvider.prototype.resolveStringValue = function (value, formatterOptions, item, column) {
				const lookupType = formatterOptions.lookupType;
				const sharedConfig = getLookupConfig(lookupType);
				const lookupConfig = _.mergeWith({}, sharedConfig, column.editorOptions?.lookupOptions);
				const isClientSearch = formatterOptions.isClientSearch ?? lookupConfig.isClientSearch;
				const displayMember = formatterOptions.displayMember ?? lookupConfig.displayMember;
				const useNewLookupType = formatterOptions.useNewLookupType ?? (lookupConfig.version > LAST_LEGACY_LOOKUP_TYPE_VERSION_NUMBER);
				const childProp = formatterOptions.childProp ?? lookupConfig.treeOptions?.childProp;
				const filter = this.getFilter(formatterOptions, lookupConfig);
				const lowercaseValue = _.toLower(value);
				let promise;
				const cacheEntity = this.entityCache.get(lowercaseValue);

				if(cacheEntity) {
					return {
						apply: true,
						valid: true,
						value: cacheEntity.Id,
					};
				}

				if (isClientSearch) {
					this.cache.active = true;
					promise = this.getList();
				} else if (useNewLookupType) {
					promise = this.getSearchList({
						SearchText: value,
						SearchFields: [displayMember],
						...this.getFilterParam(filter, item),
					}, formatterOptions);
				} else {
					const filterStrings = [`${displayMember}!=null`, `${displayMember}.ToString().Contains("${value}")`];
					const additionalFilterString = this.getFilterString(filter, item);

					if (additionalFilterString) {
						filterStrings.push(additionalFilterString);
					}

					promise = this.getSearchList(filterStrings.join(' and '), displayMember);
				}

				promise = promise.then(res => {
					if (res) {
						if (res.items) {
							return res.items;
						}
						if (res.SearchList) {
							return res.SearchList;
						}
					}
					return res;
				});

				return promise.then(entities => {
					if(entities && entities.length > 0) {
						if(childProp) {
							const flatItems = [];
							cloudCommonGridService.flatten(entities, flatItems, childProp);
							entities = flatItems;
						}

						const entity = _.find(entities, entity => {
							let valid = true;

							if (filter && !filter.serverSide) {
								valid = filter.fn(entity, item);
							}

							if (valid && lookupConfig.selectableCallback) {
								valid = lookupConfig.selectableCallback(entity, item, lookupConfig);
							}

							if (valid) {
								const displayText = _.toLower(_.get(entity, displayMember));
								valid = displayText != null && displayText === lowercaseValue;
							}

							return valid;
						});

						if (entity) {
							this.entityCache.set(lowercaseValue, entity);
							$injector.get('basicsLookupdataLookupDescriptorService').updateData(this.type, [entity]);
							return {
								apply: true,
								valid: true,
								value: entity.Id
							};
						}
					}

					return {
						apply: true,
						valid: false,
						value: value,
						error: $translate.instant('basics.common.entityNotFound')
					};
				});
			};

			// Clear cache when client context changed.
			platformContextService.contextChanged.register(function () {
				dataProviders.each(function (dataProvider) {
					if (angular.isFunction(dataProvider.clear)) {
						dataProvider.clear();
					}
				});
			});

			return {
				registerDataProviderByType: registerDataProviderByType,
				registerDataProvider: registerDataProvider,
				unregisterDataProvider: unregisterDataProvider,
				getList: getList,
				getDefault: getDefault,
				getItemByKey: getItemByKey,
				getSearchList: getSearchList,
				clear: clear,
				resolveStringValueCallback: resolveStringValueCallback,
				getLookupConfig: getLookupConfig,
				isSupportFastDataRecording: isSupportFastDataRecording
			};

			function getList(type, options) {
				var provider = dataProviders.get(type);

				if (!provider) {
					provider = registerDataProviderByType(type);
				}

				return provider.getList(options);
			}

			function getDefault(type, options) {
				var provider = dataProviders.get(type);

				if (!provider) {
					provider = registerDataProviderByType(type);
				}

				return provider.getDefault(options);
			}

			function getItemByKey(type, key, options, scope) {
				if (_.isNil(key)) { // null or undefined.
					//There are nullable lookup fields. Value not set, so no item is returned
					return $q.when(null);
				}

				var provider = dataProviders.get(type);

				options = options || {};

				if (!provider && !options.url) {
					provider = registerDataProviderByType(type);
				}

				else if (options && options.url) {
					provider = registerDataProviderByType(type, options.url);
				}

				return provider.getItemByKey(key, options, scope);
			}

			function getSearchList(type, request, options) {
				var provider = dataProviders.get(type);

				if (!provider) {
					provider = registerDataProviderByType(type);
				}

				return provider.getSearchList(request, options);
			}

			/**
			 * @description: register a data handler for lookup type.
			 * @arguments:
			 *  type: lookup type.
			 *  url: an url object, this is an option.
			 */
			function registerDataProviderByType(type, url, isCover, options) {
				var provider = dataProviders.get(type);

				if (!provider || isCover) {
					provider = getCustomDataProvider(type) || new LookupDataProvider(type, url, options);
					dataProviders.update(type, provider);
				}

				return provider;
			}

			/**
			 * @description: register a data handler for lookup type.
			 * @arguments:
			 *  type: lookup type.
			 *  handler: a LookupDataProvider instance.
			 */
			function registerDataProvider(type, handler, isCover) {
				var provider = dataProviders.get(type);

				if (!provider || isCover) {
					provider = handler;
					dataProviders.update(type, provider);
				}

				return provider;
			}

			/**
			 * @description: unregister a data handler for lookup type.
			 * @arguments:
			 *  type: lookup type.
			 *  handler: a LookupDataProvider instance.
			 */
			function unregisterDataProvider(type) {
				dataProviders.remove(type);
			}

			/**
			 * clear data cache of data providers.
			 */
			function clear() {
				dataProviders.each(function (dataProvider) {
					if (dataProvider.clear) {
						dataProvider.clear();
					}
				});
			}

			/**
			 * @description gets custom data provider.
			 * @arguments:
			 *  lookupType: case insensitive.
			 * @returns data provider or null.
			 */
			function getCustomDataProvider(lookupType) {
				var providerInfo = getProviderInfo(lookupType);
				var dataProvider = (providerInfo && providerInfo.dataProvider) ? providerInfo.dataProvider : null;
				if (dataProvider) {
					return angular.isString(dataProvider)
						? $injector.get(dataProvider)
						: dataProvider;
				}
				return null;
			}

			function getProviderInfo(lookupType) {
				if (!lookupProvider) {
					var lookup = globals.lookups, provider = {};
					for (var name in lookup) {
						if (lookup.hasOwnProperty(name)) {
							var key = name.toLowerCase();
							provider[key] = lookup[name];
						}
					}
					lookupProvider = provider;
				}
				var providerKey = lookupType.toLowerCase(), providerFn = lookupProvider[providerKey];
				if (angular.isFunction(providerFn)) {
					return providerFn($injector);
				}
				return null;
			}

			function resolveStringValueCallback(formatterOptions) {
				const lookupType = formatterOptions.lookupType;
				const dataProvider = this.registerDataProviderByType(lookupType);

				return function (value, options, item, column) {
					return dataProvider.resolveStringValue(value, formatterOptions, item, column);
				};
			}

			/**
			 * Get shared lookup configuration by lookup type
			 * @param lookupType
			 * @returns {*|{}}
			 */
			function getLookupConfig(lookupType) {
				return lookupDefinitionService.get(lookupType) ?? {}
			}

			/**
			 * Is current lookup service support fast data recording in grid
			 * @param column
			 * @returns {boolean}
			 */
			function isSupportFastDataRecording(column) {
				const lookupType = _.get(column, 'formatterOptions.lookupType');

				if (!lookupType) {
					return false;
				}

				const sharedConfig = getLookupConfig(lookupType);
				return sharedConfig.isFastDataRecording ?? false;
			}
		}

	]);

})(angular, globals);