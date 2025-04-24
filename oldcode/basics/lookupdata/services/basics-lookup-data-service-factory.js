(function (angular) {
	'use strict';

	angular.module('basics.common').factory('platformLookupDataServiceFactory', ['$q', '$http', '$injector', '_',
		'basicsLookupSimpleDataProcessor', 'BasicsLookupdataLookupDictionary', 'platformObjectHelper', 'cloudDesktopPinningContextService', '$httpParamSerializer',
		function ($q, $http, $injector, _, simpleProcessor, LookupDictionary, objectHelper, pinningContextService, $httpParamSerializer) {

			var service = {};

			function addHTTPReadAccess(container) {
				var option = container.options.httpRead;

				container.data.readData = function readData(filterData) {
					if (filterData && !angular.isString(filterData)) {
						return $http.post(option.route + option.endPointRead, filterData);
					} else if (option.usePostForRead) {
						return $http.post(option.route + option.endPointRead);
					} else {
						return $http.get(option.route + option.endPointRead + (filterData || ''));
					}
				};
			}

			function addListProcessor(container) {
				var opt = container.options;

				if (!objectHelper.isSet(container.data.listProcessor)) {
					container.data.listProcessor = [];

					container.data.doProcessList = function doProcessList(items) {
						container.data.listProcessor.forEach(function (lp) {
							lp.processList(items);
						});
					};
				}

				container.data.listProcessor.push.apply(container.data.listProcessor, opt.listProcessor);
			}

			function addDataProcessor(container) {
				var opt = container.options;

				if (!objectHelper.isSet(container.data.processor)) {
					container.data.processor = [];

					container.data.doProcessItem = function doProcessItem(item, data) {
						if (data.processor.length > 0) {
							for (var n = 0; n < data.processor.length; ++n) {
								data.processor[n].processItem(item);
							}
						}
					};

					container.data.doProcessData = function doProcessData(items, data) {
						_.forEach(items, function (item) {
							data.doProcessItem(item, data);

							if (opt.tree && item[opt.tree.childProp] && item[opt.tree.childProp].length > 0) {
								data.doProcessData(item[opt.tree.childProp], data);
							}
						});
					};
				}

				for (var n = 0; n < opt.dataProcessor.length; ++n) {
					container.data.processor.push(opt.dataProcessor[n]);
				}
			}

			function sortList(list) {
				return simpleProcessor.getSortProcessor()(list);
			}

			function addLookupServiceMethods(container) {

				var opt = container.options;

				container.service.resetCache = function (options) {

					if (opt.showFilteredData) {
						container.data.dataFilteredCache.remove(determineKey(options));
					}
					if (container.data.dataCache.remove(determineKey(options))) {
						// return a promise
						return container.service.getList(options);
					} else {
						return $q.when([]);
					}
				};

				container.service.clearCache = function () {
					container.data.dataFilteredCache.data = {};
					container.data.dataCache.data = {};
				};

				container.service.setCache = function (options, items) {
					container.data.dataCache.update(determineKey(options), items);
					if (opt.showFilteredData && _.isFunction(opt.filterOnLoadFn)) {
						container.data.dataFilteredCache.update(determineKey(options), _.filter(items, opt.filterOnLoadFn));
					}
				};

				function determineKey(options) {

					var filter = container.data.filter;
					var key = null;

					if (angular.isDefined(filter) && filter !== null && filter !== '') {
						if (angular.isObject(filter)) {
							// In case we have a object containing various filter conditions we generate a unique key
							// by transforming it into a json string and generate a hash key based on this string.
							// This procedure should return a key that describes to internal state of the filter object
							// in a way that leads to a unique reprocducible key.
							key = angular.toJson(filter);
						} else if (angular.isFunction(container.data.filterFn)) {
							key = container.data.filterFn();
						} else {
							key = filter;
						}
					} else {
						key = options.lookupType;
					}
					return key;
				}

				container.data.promiseCache = new LookupDictionary(false);
				container.data.dataCache = new LookupDictionary(false);
				container.data.dataFilteredCache = new LookupDictionary(false);
				container.data.filter = undefined;
				container.data.filterFn = container.options.filter;

				container.data.handleSuccessfulLoad = function handleSuccessfulLoad(loaded, data, key) {

					var itemList = null;
					if (loaded) {
						// remove resolved promise
						container.data.promiseCache.remove(key);
					}
					if (opt.dataEnvelope) {
						itemList = loaded[opt.dataEnvelope];
					} else {
						itemList = loaded;
					}

					if (opt.modifyLoadedData) {
						opt.modifyLoadedData(itemList, loaded);
					}

					// sort list before putting into cache
					if (!opt.dataIsAlreadySorted) {
						itemList = sortList(itemList);
					}

					if (data.doProcessList) {
						data.doProcessList(itemList);
					}

					if (data.doProcessData) {
						data.doProcessData(itemList, data);
					}

					data.dataCache.update(key, itemList);
					if (opt.showFilteredData && _.isFunction(opt.filterOnLoadFn)) {
						container.data.dataFilteredCache.update(key, _.filter(itemList, opt.filterOnLoadFn));
					}
					return itemList;
				};

				// returns data sync and triggers the async getlist if not already done => no promise
				container.service.getListSync = function getListSync(options) {
					var key = determineKey(options);
					var list = container.data.dataCache.get(key) || [];

					if (list.length === 0) {
						container.service.getList(options);
					}

					return list;
				};

				// returns data async => promise
				container.service.getList = function getList(options) {
					var defer;
					if (!options) {
						return $q.when([]);
					}
					var disDtaCache = _.isBoolean(options.disableDataCaching) && options.disableDataCaching;
					var key = determineKey(options);
					var list = container.data.dataCache.get(key);
					if (((_.isEmpty(list) || disDtaCache)) && !container.options.dataAlreadyLoaded) {
						var promise = container.data.promiseCache.get(key);
						if (!promise) {
							defer = $q.defer();
							container.data.promiseCache.add(key, defer);
							if (!container.options.filterParam) {
								container.data.readData(null).then(function (response) {
									defer.resolve(container.data.handleSuccessfulLoad(response.data, container.data, key));
								}, function (error) {
									console.log('fail to load data for lookup type: ' + container.options.httpRead.route + container.options.httpRead.endPointRead);
									defer.reject(error);
									defer = null;
									container.data.promiseCache.remove(key);
								});
							} else {
								var filter = container.data.filter;
								if (opt.prepareFilter) {
									filter = opt.prepareFilter(filter);
								} else if (angular.isString(filter) || angular.isNumber(filter) || _.isBoolean(filter)) {
									filter = '?' + opt.filterParam + '=' + filter;
								} else if (!filter && !_.isEmpty(options.pinningContextFilter)) {
									filter = getFilterFromPinningContext(options.pinningContextFilter, container.options);
								}
								container.data.readData(filter).then(function (response) {
									defer.resolve(container.data.handleSuccessfulLoad(response.data, container.data, key));
								}, function (error) {
									console.log('fail to load data for lookup type: ' + container.options.httpRead.route + container.options.httpRead.endPointRead);
									defer.reject(error);
									defer = null;
									container.data.promiseCache.remove(key);
								});
							}
						} else {
							defer = promise;
						}

					} else {
						defer = $q.defer();
						defer.resolve(list);
					}

					return defer.promise;
				};
				// new end

				container.service.getFilteredListSync = function getFilteredListSync(options) {
					var key = determineKey(options);
					var list = container.data.dataFilteredCache.get(key) || [];

					if (list.length === 0) {
						container.service.getList(options);
					}

					return list;
				};

				container.service.getFilteredList = function getList(options) {
					var defer;
					defer = $q.defer();
					if (!options) {
						return $q.when([]);
					}
					var key = determineKey(options);
					var list = container.data.dataFilteredCache.get(key);
					if (_.isEmpty(list)) {
						container.service.getList(options).then(function () {
							defer.resolve(container.data.dataFilteredCache.get(key));
						});
					} else {
						defer.resolve(list);
					}
					return defer.promise;
				};

				function getFilterFromPinningContext(pinningContextFilter, containerOptions) {
					var filterParamName = containerOptions.filterParam;
					var filterObj = {};
					var pinningItem = pinningContextService.getPinningItem(pinningContextFilter[0]);
					filterObj[filterParamName] = pinningItem && pinningItem.id ? pinningItem.id : null;
					return buildUrl('', filterObj);
				}

				container.service.getLookupData = function getLookupData(options) {
					if (opt.showFilteredData) {
						return container.service.getFilteredList(options);
					}
					return container.service.getList(options);
				};

				container.data.flatten = function flatten(input, output, childProp) {
					_.forEach(input, function (item) {
						output.push(item);
						if (item[childProp] && item[childProp].length > 0) {
							container.data.flatten(item[childProp], output, childProp);
						}
					});
					return output;
				};

				container.data.getByFilter = function getByFilter(filterFn, options) {
					var itemList = container.service.getListSync(options);

					if (container.options.tree) {
						itemList = container.data.flatten(itemList, [], container.options.tree.childProp);
					}

					return _.find(itemList, function (item) {
						return filterFn(item);
					});
				};

				container.data.getByFilterAsync = function getByFilterAsync(filterFn, options) {
					var defer = $q.defer();
					container.service.getList(options).then(function (itemList) {
						if (options.tree || $injector.get(options.dataServiceName).getTreeInfo) {
							itemList = container.data.flatten(itemList, [], opt.tree.childProp);
						}

						var item = _.find(itemList, function (item) {
							return filterFn(item);
						});

						defer.resolve(item);
					}
					);
					return defer.promise;
				};

				container.service.getDefault = function getDefault(options) {
					return container.data.getByFilter(function (item) {
						return (item.IsDefault === true || item.Isdefault === true);
					}, options);
				};

				container.service.getItemById = function getItemById(ID, options) {
					return container.data.getByFilter(function (item) {
						return item[options.valueMember || 'Id'] === ID;
					}, options);
				};

				container.service.getItemByIdAsync = function getItemById(ID, options) {

					var defer = $q.defer();
					var filterFn = function (item) {
						return item[options.valueMember || 'Id'] === ID;
					};

					container.data.getByFilterAsync(filterFn, options).then(function (filterResult) {
						defer.resolve(filterResult);
					}
					);

					return defer.promise;
				};

				if (opt.filterParam) {
					container.service.setFilter = function setFilter(filter) {
						container.data.filter = filter;
					};

					container.service.clearFilter = function clearFilter() {
						container.data.filter = undefined;
					};

				}

				if (opt.navigator) {
					container.service.getNavigatorConfig = function getNavigatorConfig() {
						return opt.navigator;
					};
				}

				if (opt.selectableCallback && angular.isFunction(opt.selectableCallback)) {
					container.service.selectableCallback = opt.selectableCallback;
				}

				if(opt.resolveStringValueCallback) {
					container.service.resolveStringValue = (value, options, entity, columnDef) => {
						return opt.resolveStringValueCallback(value, options, container.service, entity, columnDef)
							.then(result => result, () => {
								return {
									apply: true,
									valid: false,
									error: 'internal error or not supported!'
								};
							});
					};
				}
			}

			function createElementFromScratch(container) {

				if (!container.options.dataAlreadyLoaded) {
					addHTTPReadAccess(container);
				}

				if (container.options.listProcessor) {
					addListProcessor(container);
				}

				if (container.options.dataProcessor) {
					addDataProcessor(container);
				}

				addLookupServiceMethods(container);

				if (container.options.tree) {
					container.service.getTreeInfo = function getTreeInfo() {
						return container.options.tree;
					};
				}

				return container;
			}

			service.createInstance = function createInstance(options) {
				var container = {options: options, data: {}, service: {}};

				return createElementFromScratch(container);
			};

			function buildUrl(url, params) {
				var serializedParams = $httpParamSerializer(params);

				if (serializedParams.length > 0) {
					url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
				}

				return url;
			}

			return service;
		}]);
})(angular);

