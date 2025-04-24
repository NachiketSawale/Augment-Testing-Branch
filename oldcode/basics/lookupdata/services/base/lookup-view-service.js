/**
 * Created by wui on 2/6/2015.
 * @description configure lookup template by lookup edit type.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	/*jshint -W072*/ //too much parameters
	/*jshint -W074*/ //complex function
	angular.module(moduleName).factory('basicsLookupdataLookupViewService', [
		'_',
		'platformObjectHelper',
		'$q',
		'globals',
		'basicsLookupdataTreeHelper',
		'basicsCommonUtilities',
		'$templateCache',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDefinitionService',
		'platformDialogService',
		'basicsLookupdataLookupDataService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupKeyService',
		'basicsLookupdataLookupOptionService',
		'lookupPageSizeService',
		'mainViewService',
		function (_,
			platformObjectHelper,
			$q,
			globals,
			basicsLookupdataTreeHelper,
			basicsCommonUtilities,
			$templateCache,
			lookupFilterService,
			lookupDefinitionService,
			platformDialogService,
			lookupDataService,
			lookupDescriptorService,
			basicsLookupdataLookupKeyService,
			basicsLookupdataLookupOptionService,
			lookupPageSizeService,
			mainViewService) {

			function LookupDataView() {
				this.scope = null;
				this.dataProvider = {};
				this.dataContext = {
					isTree: false,
					idProperty: '',
					options: {}
				};
				this.dataFilter = {
					filter: null,
					filterText: '',
					data: [],
					serverKey: null,
					version: 0
				};
				this.dataCache = {
					isActive: false,
					isLoaded: false,
					data: []
				};
				this.dataPage = {
					enabled: false,
					size: null,
					number: 0,
					count: 0,
					currentLength: 0,
					totalLength: 0
				};
				this.dataProcessor = {};
				this.searchResult = {};
				this.state = {
					inputSearch: false
				};
				this.processResult = new window.Map();
			}

			LookupDataView.searchDefaults = {
				searchField: '',
				searchString: '',
				isCaseSensitive: false
			};

			LookupDataView.getSearchListDefaults = {
				searchFields: [],
				searchString: '',
				serverSearch: false,
				filterString: '',
				filterFields: [],
				filterValues: [],
				lookupKey: ''
			};

			LookupDataView.prototype.init = function (options) {
				var self = this;

				self.dataContext.options = options;
				if (options.treeOptions) {
					self.dataContext.isTree = true;
				}
				if (options.filterKey) {
					options.filterOptions = lookupFilterService.getFilterByKey(options.filterKey);
				}
				if (basicsLookupdataLookupKeyService.hasPKey(options)) {
					options.idProperty = '__id';
					if (options.treeOptions) {
						options.treeOptions.__parentProp = options.treeOptions.parentProp;
						options.treeOptions.parentProp = '__parentId';
					}
				}
				self.dataContext.idProperty = options.idProperty || options.valueMember;
				self.dataProvider = options.dataProvider;
				_.merge(self.dataPage, options.pageOptions);
				self.setFilter(options.filterOptions);
				self.setDataProcessor(options.dataProcessor);
				self.setDataProcessors(options.dataProcessors);
				if (_.isBoolean(options.disableDataCaching)) {
					self.setDataCache(!options.disableDataCaching);
				} else {
					self.setDataCache(false);
				}
				if (options.eagerLoad) {
					self.loadData();
				}
			};

			LookupDataView.prototype.loadData = function (request) {
				var self = this, loadDataDeferred = $q.defer(), searchString = '',
					isFilterChanged = self.isFilterChanged(),
					options = self.dataContext.options || {},
					getSearchListSettings = _.merge({
						lookupKey: options.lookupKey
					}, LookupDataView.getSearchListDefaults, request);

				var searchRequest = {
					SearchFields: [],
					SearchText: '',
					FilterKey: self.dataFilter.serverKey,
					AdditionalParameters: self.dataFilter.filterParams,
					TreeState: {
						StartId: null,
						Depth: null
					},
					RequirePaging: self.dataPage.enabled
				};

				if (request) {
					searchRequest.SearchFields = request.searchFields;
					searchRequest.SearchText = request.searchString;
					if (request.formEntity) {
						searchRequest.FormEntity = request.formEntity;
					}
				}

				// if external filter string is exist, then refresh data from server always.
				if (request && angular.isString(request.filterString) && request.filterString.length) {
					self.dataCache.isLoaded = false;
					searchString = request.filterString;
				}

				if (self.dataCache.isActive && self.dataCache.isLoaded && !isFilterChanged) {
					self.dataFilter.data = self.doFilter(self.dataCache.data);
					loadDataDeferred.resolve(self.dataFilter.data);
				} else {
					var successCallback = function (result) {
						var data;

						if (angular.isArray(result)) {
							data = result;
						} else if (angular.isObject(result)) {
							// todo-wui: result from new lookup master api "getSearchList"
							data = result.SearchList ? result.SearchList : result.items;
							if (!(request && request.treeOptions && request.treeOptions.lazyLoad && request.treeOptions.startId)) {
								if (request && request.delaySetPageInfo) {
									self.pageInfo = {
										itemsFound: result.itemsFound,
										itemsRetrieved: result.itemsRetrieved
									};
								} else {
									self.dataPage.totalLength = result.itemsFound;
									self.dataPage.currentLength = result.itemsRetrieved;
									self.dataPage.count = Math.ceil(self.dataPage.totalLength / self.dataPage.size);
								}
							}
						} else {
							data = [];
						}

						loadDataDeferred.resolve(self.processData(data));
					};

					self.dataCache.isLoaded = false;

					if (self.dataFilter.filterText) {
						if (searchString) {
							searchString = '(' + searchString + ')' + ' and ';
						}
						searchString = searchString + '(' + self.dataFilter.filterText + ')';
						_.merge(getSearchListSettings, self.dataFilter.filterParams);
					}

					if (searchString || self.dataPage.enabled || (request && request.treeOptions && request.treeOptions.lazyLoad)) {
						if (self.dataPage.enabled) {
							searchRequest.PageState = {
								PageNumber: self.dataPage.number,
								PageSize: self.dataPage.size
							};
						}

						if (request && request.treeOptions && request.treeOptions.lazyLoad) {
							searchRequest.TreeState.StartId = request.treeOptions.startId;
							searchRequest.TreeState.Depth = !searchRequest.SearchText ? (request.treeOptions.depth > 0 ? request.treeOptions.depth : 1) : null;
						}

						if (self.dataPage.enabled) {
							searchRequest.RequirePaging = true;
							if (request && request.treeOptions && request.treeOptions.startId) {
								searchRequest.RequirePaging = false;
							}
						}

						// set additional filters to Request for grid popup-search
						if (_.isEmpty(searchRequest.AdditionalParameters) && this.scope.options.additionalFilters) {
							const tscope = this.scope;
							const sOptions = tscope.options;
							if (sOptions.additionalFilters.length > 0) {
								angular.forEach(sOptions.additionalFilters, function (additionalFilter) {
									angular.forEach(sOptions.detailConfig.rows, function (row) {
										if (!_.isNil(additionalFilter) && !_.isNil(additionalFilter[row.model]) && _.isFunction(additionalFilter.getAdditionalEntity)) {
											let filterName = _.camelCase(additionalFilter[row.model]);
											let value = additionalFilter.getAdditionalEntity(tscope.entity)[additionalFilter[row.model]];
											searchRequest.AdditionalParameters[filterName] = value;
										}
									});
								});
							}
						}

						var curScope;

						// todo-wui: using new search approach.
						if (self.dataContext.options.version === 2) {
							if (self.dataFilter.version !== 1) { // old server side filer, still string
								if (self.dataPage.enabled && (!_.isNumber(self.dataPage.size) || self.dataPage.size <= 0)) {
									curScope = this.scope;
									lookupPageSizeService.getPageSizeAsync().then(function (pageSize) {
										self.dataPage.size = pageSize;
										searchRequest.PageState.PageSize = pageSize;
										self.dataProvider.getSearchList(JSON.stringify(searchRequest), options.displayMember, curScope).then(successCallback);
									});
								} else {
									self.dataProvider.getSearchList(JSON.stringify(searchRequest), options.displayMember, this.scope).then(successCallback);
								}

								return loadDataDeferred.promise;
							}
						} else if (self.dataContext.options.version === 3) {
							if (self.dataFilter.version !== 1) { // old server side filer, still string
								if (self.dataPage.enabled && (!_.isNumber(self.dataPage.size) || self.dataPage.size <= 0)) {
									curScope = this.scope;
									lookupPageSizeService.getPageSizeAsync().then(function (pageSize) {
										self.dataPage.size = pageSize;
										searchRequest.PageState.PageSize = pageSize;
										self.dataProvider.getSearchList(searchRequest, curScope.options, curScope).then(successCallback);
									});
								} else {
									self.dataProvider.getSearchList(searchRequest, this.scope.options, this.scope).then(successCallback);
								}

								return loadDataDeferred.promise;
							}
						}

						self.dataProvider.getSearchList(searchString, options.displayMember, this.scope, getSearchListSettings).then(successCallback);
					} else {
						// rei added 23.2 2. parameter this.scope >> having the right scope in the getList data provider
						self.dataProvider.getList(this.scope.options, this.scope, getSearchListSettings).then(successCallback);
					}
				}

				return loadDataDeferred.promise;
			};

			LookupDataView.prototype.processData = function (data) {
				if (!angular.isArray(data) && !angular.isObject(data)) {
					return [];
				}

				var self = this, resData = [], options = self.dataContext.options;

				// refresh cache data of descriptor service.
				lookupDescriptorService.refresh(self.dataContext.options.lookupType, data);

				// process data by extra logic.
				if (self.dataProcessor && angular.isFunction(self.dataProcessor.execute)) {
					if (_.isNil(self.scope)) {
						resData = self.dataProcessor.execute(data);
					} else {
						resData = self.dataProcessor.execute(data, this.scope.options);
					}
				} else {
					resData = data;
				}

				// set composite key identification
				if (basicsLookupdataLookupKeyService.hasPKey(options)) {
					self.identify(resData, options);
				}

				// build tree structure
				if (self.dataContext.isTree && !self.dataContext.options.disableBuildTree) {
					var context = {
						treeOptions: self.dataContext.options.treeOptions,
						IdProperty: (self.dataContext.options.treeOptions.idProperty) ? self.dataContext.options.treeOptions.idProperty : self.dataContext.idProperty //idProperty must be uniq....
					};
					resData = basicsLookupdataTreeHelper.buildTree(resData, context);
				}

				// make data cache
				if (self.dataCache.isActive) {
					self.dataCache.isLoaded = true;
					self.dataCache.data = resData;
				}

				// apply filter
				resData = self.doFilter(resData);

				if (self.dataCache.isActive) {
					self.dataFilter.data = resData;
				}

				self.doProcess(resData);

				return resData;
			};

			LookupDataView.prototype.doProcess = function doProcess(data) {

				// process by data processors
				if (!_.isEmpty(this.dataProcessors)) {
					var self = this, newItems = _.filter(data, function newItemFilter(item) {
						return !self.processResult.has(item);
					});
					_.forEach(newItems, function resDataIterator(item) {
						if (item) {
							_.forEach(self.dataProcessors, function processorIterator(processor) {
								if (_.isNil(self.scope)) {
									processor.processItem(item);
								} else {
									processor.processItem(item, self.scope.options);
								}
							});
						}
						self.processResult.set(item, true);
					});
				}

			};

			LookupDataView.prototype.setScope = function (value) {
				this.scope = value;
			};

			LookupDataView.prototype.setDataProcessor = function (value) {
				this.dataProcessor = value;
			};

			LookupDataView.prototype.setDataProcessors = function setDataProcessors(value) {
				this.dataProcessors = value;
			};

			LookupDataView.prototype.setDataCache = function (value) {
				this.dataCache.isActive = value;
				if (angular.isFunction(this.dataProvider.state)) {
					this.dataProvider.state({cache: value});
				}
			};

			LookupDataView.prototype.setFilter = function (filter) {
				if (!filter) {
					return;
				}

				var self = this;

				self.dataFilter.filter = filter;
				self.dataFilter.serverKey = filter.serverKey;

				if (filter.serverSide) {
					self.dataFilter.filterParams = filter.fn(self.scope.entity || {}, self.state);

					if (angular.isObject(self.dataFilter.filterParams)) {
						self.dataFilter.filterText = JSON.stringify(self.dataFilter.filterParams);
						self.dataFilter.version = 2;
					} else if (angular.isString(self.dataFilter.filterParams)) {
						self.dataFilter.filterText = self.dataFilter.filterParams;
						self.dataFilter.filterParams = {};
						self.dataFilter.version = 1;
					}
				}
			};

			LookupDataView.prototype.getFilterFn = function () {
				var self = this, filterFn = null;

				if (self.dataFilter.filter && !self.dataFilter.filter.serverSide) {
					filterFn = function (item) {
						return self.dataFilter.filter.fn(item, self.scope.entity || {}, self.state);
					};
				}

				return filterFn;
			};

			LookupDataView.prototype.isFilterChanged = function () {
				var self = this;
				var isChanged = false;
				var newFilterText = '';

				if (self.dataFilter.filter && self.dataFilter.filter.serverSide) {
					self.dataFilter.filterParams = self.dataFilter.filter.fn(self.scope.entity || {}, self.state);

					if (angular.isObject(self.dataFilter.filterParams)) {
						newFilterText = JSON.stringify(self.dataFilter.filterParams);
					} else if (angular.isString(self.dataFilter.filterParams)) {
						newFilterText = self.dataFilter.filterParams;
						self.dataFilter.filterParams = {};
					}

					if (self.dataFilter.filterText !== newFilterText) {
						self.dataFilter.filterText = newFilterText;
						isChanged = true;
					}
				}

				return isChanged;
			};

			LookupDataView.prototype.doFilter = function (data) {
				let self = this, dataAfterFilter = data, filterFn = self.getFilterFn();

				if (_.isArray(data) && _.isFunction(filterFn)) {
					if (self.dataContext.isTree) {
						let context = {
							treeOptions: self.dataContext.options.treeOptions,
							judgeFn: filterFn
						};

						dataAfterFilter = basicsLookupdataTreeHelper.filterTree(data, context).matchTree;
					} else {
						dataAfterFilter = data.filter(filterFn);
					}
				}

				// Fixed ALM 138196 # Interim fixes, filterOnLoadFn is not a standard lookup option, it was introduced at revision 578930 in trunk, related to ALMs 93853.
				if (_.isArray(dataAfterFilter) && self.dataContext.options.showFilteredData && _.isFunction(self.dataContext.options.filterOnLoadFn)) {
					let filterFn = function (item) {
						return self.dataContext.options.filterOnLoadFn(item, self.scope.entity || {}, self.state);
					};
					if (self.dataContext.isTree) {
						let context = {
							treeOptions: self.dataContext.options.treeOptions,
							judgeFn: filterFn
						};
						dataAfterFilter = basicsLookupdataTreeHelper.filterTree(dataAfterFilter, context).matchTree;
					} else {
						dataAfterFilter = dataAfterFilter.filter(filterFn);
					}
				}

				return dataAfterFilter;
			};

			LookupDataView.prototype.search = function (options) {
				var self = this,
					searchDeferred = $q.defer(),
					globalOptions = self.dataContext.options,
					settings = _.merge({}, LookupDataView.searchDefaults, options),
					loadDataArgs = {
						searchFields: settings.searchFields,
						searchString: settings.searchString,
						doRefresh: settings.doRefresh,
						serverSearch: false,
						filterString: '',
						treeOptions: settings.treeOptions,
						delaySetPageInfo: settings.delaySetPageInfo
					};

				// set state
				self.state.inputSearch = true;
				// clear last search result.
				self.searchResult = {};

				// if it isn't paging search, reset page number.
				if (!options.paging) {
					self.dataPage.number = 0;
				}

				// judge if search in server side and build search string.
				if (!self.dataCache.isActive && settings.searchString && settings.searchString.length > 0 && !globalOptions.isClientSearch) {
					loadDataArgs.filterString = self.buildSearchString(settings.searchString, loadDataArgs.searchFields);
					loadDataArgs.serverSearch = true;
				}

				if (settings.searchString || self.dataPage.enabled) {
					self.loadData(loadDataArgs).then(function (data) {
						var searchResult = {
								matchedList: [],
								matchedTree: [],
								similarItem: null,
								searchString: settings.searchString
							},
							getMatchFn = function (matchOptions) {
								var matchContext = _.merge({}, settings, matchOptions);
								return function (dataItem) {
									return self.matchItem(dataItem, matchContext);
								};
							};

						if (loadDataArgs.filterString && !self.dataContext.options.isClientSearch) { // handle server side search result.
							if (angular.isArray(data)) {
								searchResult.matchedTree = data;
								if (self.dataContext.isTree) {
									searchResult.matchedList = basicsLookupdataTreeHelper.flatten(searchResult.matchedTree, {
										treeOptions: self.dataContext.options.treeOptions
									});
								} else {
									searchResult.matchedList = searchResult.matchedTree;
								}
							}
						} else { // do search in client side.
							if (self.dataContext.isTree) {
								var context = {
									treeOptions: self.dataContext.options.treeOptions,
									judgeFn: getMatchFn({matchFields: loadDataArgs.searchFields})
								};

								if (self.dataCache.isActive) {
									data = angular.copy(data);
								}

								var filterResult = basicsLookupdataTreeHelper.filterTree(data, context);

								searchResult.matchedTree = filterResult.matchTree;
								searchResult.matchedList = filterResult.matchList;
							} else {
								searchResult.matchedList = data.filter(getMatchFn({matchFields: loadDataArgs.searchFields}));
								searchResult.matchedTree = searchResult.matchedList;
							}
						}

						// find most similar item from matched items to complete value in edit box.
						let matchedList = searchResult.matchedList;

						if (matchedList.length) {
							let filteredList = self.dataContext.options.selectableCallback ?
								matchedList.filter(item => { return self.dataContext.options.selectableCallback(item, self.scope.entity, self.scope.settings)})
								: matchedList;

							let exactItems = filteredList.filter(getMatchFn({
								matchExact: true,
								matchFields: [globalOptions.displayMember]
							}));

							if (exactItems.length) {
								searchResult.similarItem = exactItems[0];
							} else {
								let similarItems = filteredList.filter(getMatchFn({
									matchFront: true,
									matchFields: [globalOptions.displayMember]
								}));

								if (similarItems.length) {
									searchResult.similarItem = similarItems[0];
								}
							}
						}

						// cache last search result.
						self.searchResult = searchResult;
						searchDeferred.resolve(searchResult);
					});
				} else {
					searchDeferred.resolve({
						matchedList: self.dataFilter.data,
						matchedTree: self.dataFilter.data,
						similarItem: null,
						searchString: settings.searchString
					});
				}

				return searchDeferred.promise;
			};

			LookupDataView.prototype.simpleSearch = function (options) {
				var self = this, settings = _.merge({}, LookupDataView.searchDefaults, options);

				// set state
				self.state.inputSearch = false;
				return self.loadData({
					searchFields: settings.searchFields,
					searchString: settings.searchString,
					doRefresh: settings.doRefresh,
					serverSearch: true,
					filterString: self.buildSearchString(settings.searchString, settings.searchFields),
					formEntity: settings.formEntity,
					treeOptions: settings.treeOptions
				});
			};

			LookupDataView.prototype.matchItem = function (dataItem, context) {
				var self = this,
					flags = context.isCaseSensitive ? '' : 'i',
					pattern = basicsCommonUtilities.ensurePattern(context.searchString);

				if (self.dataContext.options.isExactSearch || context.matchExact) {
					pattern = '^' + pattern + '$';
				} else if (context.matchFront) {
					pattern = '^' + pattern;
				}

				var expression = new RegExp(pattern, flags);

				return context.matchFields.some(function (matchField) {
					var value = platformObjectHelper.getValue(dataItem, matchField);

					var valueList = [];
					valueList.push(value);
					if (!_.isNil(value) && _.isObject(value)) {
						if (!_.isNil(value.Description)) {
							valueList.push(value.Description);
						}
						if (!_.isNil(value.Translated)) {
							valueList.push(value.Translated);
						}
						if (!_.isNil(value.OtherLanguages)) {
							_.forEach(value.OtherLanguages, function (value) {
								if (!_.isNil(value)) {
									valueList.push(value.Description);
								}
							});
						}
					}

					return (value === null || angular.isUndefined(value)) ? false :
						_.some(valueList, function (val) {
							return expression.test(angular.isString(val) ? val : val.toString());
						});
				});
			};

			LookupDataView.prototype.invalidateData = function () {
				if (this.dataCache.isLoaded) {
					this.dataCache.isLoaded = false;
				}
				if (this.dataProvider.clear) {
					this.dataProvider.clear();
				}
			};

			LookupDataView.prototype.getItemById = function (identification) {
				var self = this, result = null,
					options = self.dataContext.options,
					equalFn = function (dataItem) {
						return basicsLookupdataLookupKeyService.equal(dataItem, identification, options, true);
					};

				if (self.dataCache.data && self.dataCache.data.length) {
					if (self.dataContext.isTree) {
						var context = {
							treeOptions: self.dataContext.options.treeOptions,
							judgeFn: equalFn
						};
						result = basicsLookupdataTreeHelper.findNode(self.dataCache.data, context);
					} else {
						for (var i = 0; i < self.dataCache.data; i++) {
							if (equalFn(self.dataCache.data[i])) {
								result = self.dataCache.data[i];
								self.updateDescriptor(result);
								break;
							}
						}
					}
				}

				if (!result) {
					if (self.dataCache.isActive && lookupDescriptorService.hasLookupItem(self.dataContext.options.lookupType, identification)) {
						result = lookupDescriptorService.getLookupItem(self.dataContext.options.lookupType, identification);
						self.doProcess([result]);
					} else {
						if (angular.isObject(identification)) {
							identification = basicsLookupdataLookupKeyService.getIdentificationData(identification.Id, identification, options, true);
						}

						result = self.dataProvider.getItemByKey(identification, self.dataContext.options, self.scope);

						if (result) {
							$q.when(result).then(function (dataItem) {
								self.doProcess([dataItem]);
								self.updateDescriptor(dataItem);
							});
						}
					}
				}

				if (basicsLookupdataLookupKeyService.hasPKey(options)) {
					self.identify([result], options);
				}

				return $q.when(result);
			};

			LookupDataView.prototype.identify = function (dataItems, options) {
				if (!(dataItems && dataItems.length)) {
					return;
				}

				var self = this;

				if (self.dataContext.isTree) {
					dataItems = basicsLookupdataTreeHelper.flatten(dataItems, {
						treeOptions: self.dataContext.options.treeOptions
					});
				}

				dataItems.forEach(function (dataItem) {
					dataItem[options.idProperty] = basicsLookupdataLookupKeyService.getIdentificationValue(
						dataItem.Id,
						dataItem,
						options,
						true
					);
					if (self.dataContext.isTree) {
						dataItem[options.treeOptions.parentProp] = basicsLookupdataLookupKeyService.getIdentificationValue(
							dataItem[options.treeOptions.__parentProp],
							dataItem,
							options,
							true
						);
					}
				});
			};

			LookupDataView.prototype.updateDescriptor = function (dataItem) {
				lookupDescriptorService.updateData(this.dataContext.options.lookupType, [dataItem]);
			};

			/**
			 * Build filter string for search text
			 * @param searchString
			 * @param searchFields
			 * @returns {*}
			 */
			LookupDataView.prototype.buildSearchString = function (searchString, searchFields) {
				var self = this, globalOptions = self.dataContext.options;

				if (angular.isFunction(globalOptions.buildSearchString)) {
					return globalOptions.buildSearchString(searchString);
				} else {
					return basicsCommonUtilities.buildSearchFilter(searchFields, searchString);
				}
			};

			/**
			 * Reset data page parameters to initial.
			 * @param dataPage
			 */
			LookupDataView.prototype.resetDataPage = function (dataPage) {
				this.dataPage = angular.extend(this.dataPage, dataPage || {
					count: 0,
					currentLength: 0,
					number: 0,
					totalLength: 0
				});
			};

			LookupDataView.prototype.destroy = function () {
				this.scope = null;
			};

			return {
				config: config,
				saveSize: saveSize,
				restoreSize: restoreSize,
				showDialog: showDialog,
				LookupDataView: LookupDataView
			};

			function config(type, options) { /*jshint -W074*/ //this function's cyclomatic is too high
				var defaults;

				options.dataView = new LookupDataView();

				switch (type) {
					case 'input-base':
						if (globals.devFeatureFlags && globals.devFeatureFlags.lookupSearchPopup) {
							defaults = {
								width: '600px',
								height: options.pageOptions && options.pageOptions.enabled ? '500px' : '400px',
								minWidth: '470px',
								template: $templateCache.get('grid-dialog-lookup.html'),
								controller: 'basicsLookupdataGridDialogController'
							};

							//resizeable-function for dialog
							options.resizeable = true;
							options.popupOptions = {
								width: 300,
								height: 300,
								template: $templateCache.get('grid-popup-lookup.html'),
								footerTemplate: $templateCache.get('lookup-popup-footer.html'),
								controller: 'basicsLookupdataGridPopupController',
								showLastSize: true
							};
						}
						break;

					case 'tree-control':
						defaults = {
							width: 300,
							height: 300,
							template: $templateCache.get('tree-control-lookup.html'),
							controller: 'basicsLookupdataTreeControlController'
						};
						options.popupOptions = _.merge(defaults, options.popupOptions);
						break;

					case 'grid-dialog':
					case 'dialog-edit':
						defaults = {
							width: '600px',
							height: options.pageOptions && options.pageOptions.enabled ? '600px' : '550px',
							minWidth: '470px',
							template: $templateCache.get('grid-dialog-lookup.html'),
							controller: 'basicsLookupdataGridDialogController'
						};

						if (options.formContainerOptions && options.formContainerOptions.formOptions.configure) {
							defaults.height = '90%';
						}

						//resizeable-function for dialog
						options.resizeable = true;
						options.popupOptions = {
							width: 300,
							height: 300,
							template: $templateCache.get('grid-popup-lookup.html'),
							footerTemplate: $templateCache.get('lookup-popup-footer.html'),
							controller: 'basicsLookupdataGridPopupController',
							showLastSize: true
						};
						options.dialogOptions = _.merge(defaults, options.dialogOptions);

						_.merge(options, {
							minWidth: options.dialogOptions.minWidth,
							maxWidth: options.dialogOptions.maxWidth,
							maxHeight: options.dialogOptions.maxHeight,
							width: options.dialogOptions.width,
							height: options.dialogOptions.height
						});

						// if don't specify cache strategy
						if (_.isNil(options.disableDataCaching)) {
							options.disableDataCaching = true;
						}
						break;

					case 'grid-popup':
					case 'lookup-edit':
						defaults = {
							width: 300,
							height: 300,
							template: $templateCache.get('grid-popup-lookup.html'),
							footerTemplate: $templateCache.get('lookup-popup-footer.html'),
							controller: 'basicsLookupdataGridPopupController',
							showLastSize: true
						};
						options.popupOptions = _.merge(defaults, options.popupOptions);
						// if don't specify cache strategy and enabled paging feature.
						if (_.isNil(options.disableDataCaching) && (options.pageOptions && options.pageOptions.enabled)) {
							options.disableDataCaching = true;
						}
						break;

					case 'combo-popup':
					case 'combobox-edit':
						defaults = {
							template: $templateCache.get('combo-popup-lookup.html'),
							footerTemplate: $templateCache.get('lookup-popup-footer.html'),
							controller: 'basicsLookupdataComboPopupController'
						};
						options.popupOptions = _.merge(defaults, options.popupOptions);
						break;

					case 'custom-dialog': // custom lookup search dialog.
						// in order to show drop down list when auto complete input value.
						options.popupOptions = {
							template: $templateCache.get('combo-popup-lookup.html'),
							controller: 'basicsLookupdataComboPopupController'
						};
						break;
				}
			}

			function saveSize(uuid, size) {
				if (uuid) {
					mainViewService.customData(uuid, 'popupSize', size);
				}
			}

			function restoreSize(uuid, config) {
				if (uuid) {
					var size = mainViewService.customData(uuid, 'popupSize');
					if (size) {
						config.width = size.width;
						config.height = size.height;
					}
				}
			}

			function showDialog(options) {
				var defaults = {
						// string, lookup type.
						lookupType: '',
						// string, initial value set to search box.
						initialSearchValue: '',
						// boolean, auto search as soon as dialog open.
						eagerSearch: false,
						// string, id property, default 'Id'.
						idProperty: 'Id',
						// boolean, disable data cache.
						disableDataCaching: true,
						// string array, properties to search when input change
						inputSearchMembers: ['SearchPattern']
					},
					lookupOptions = lookupDefinitionService.get(options.lookupType),
					settings = _.mergeWith({dataView: new LookupDataView()}, defaults, lookupOptions, options, basicsLookupdataLookupOptionService.customizer);

				if (!settings.dataProvider) {
					settings.dataProvider = lookupDataService.registerDataProviderByType(settings.lookupType);
				}

				return platformDialogService.showDialog({
					width: '606px',
					height: '500px',
					template: $templateCache.get('grid-dialog-lookup.html'),
					controller: 'basicsLookupdataGridSelectionController',
					resolve: {
						'$options': function () {
							return settings;
						}
					},
					resizeable: true
				});
			}

		}
	]);

})(angular);
