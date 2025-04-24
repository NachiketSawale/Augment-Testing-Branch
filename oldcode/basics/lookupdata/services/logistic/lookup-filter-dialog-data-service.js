/**
 * Created by leo on 17.10.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name lookupFilterDialogDataService
	 * @function
	 *
	 * @description
	 * lookupFilterDialogDataService is the data service for reservation look ups
	 */
	angular.module('basics.lookupdata').factory('lookupFilterDialogDataService',
		['platformLookupDataServiceFactory', '$q', 'PlatformMessenger', '$injector',

			function (platformLookupDataServiceFactory, $q, PlatformMessenger, $injector) {
				var filterService = {};

				filterService.createInstance = function createInstance(options) {
					return creatDataService(options);
				};

				function creatDataService(options) {
				
					var service = {};
					var selectedItem = null;
					service.listLoaded = new PlatformMessenger();
					service.selectionChanged = new PlatformMessenger();

					service.selectedObject = {};
					if(!options) {
						options = {};
					}
					service.options = options;

					function getSearchList (searchString, options, searchSettings) {
						var deferred = $q.defer();
						if (dataService) {
							if(!_.isObject(searchString)){
								service.setOwnFilter(searchString);
							}
							dataService.getList(options).then(function (data) {
								var list = _.cloneDeep(data);
								if (searchSettings && searchString) {
									var context = {
										searchString: searchSettings.searchString,
										matchFields: searchSettings.searchFields,
										isCaseSensiive: false
									};
									list = _.filter(_.cloneDeep(data), function (item) {
										var result = false;
										if (options.treeOptions && item[options.treeOptions.childProp].length > 0) {
										// var res = search(item[options.treeOptions.childProp], searchSettings);
											var res = search(item[options.treeOptions.childProp], context, options.dataView);
											result = res.result;
											item[options.treeOptions.childProp] = res.list;
										}
										result = result || options.dataView.matchItem(item, context);
										return result;
									});
								}
								service.listLoaded.fire(list);
								deferred.resolve(list);
							});
						} else {
							service.listLoaded.fire([]);
							deferred.resolve([]);
						}
						return deferred.promise;
					}

					var dataService = null;
					if(options.httpRoute){
						var filterLookupDataServiceConfig = {
							httpRead: {route: globals.webApiBaseUrl + options.httpRoute, endPointRead: options.endPointRead, usePostForRead: !!options.usePostForRead},
							filterParam: options.filterParam,
							dataProcessor: options.dataProcessor,
							dataEnvelope: options.dataEnvelope ? options.dataEnvelope : null,
							prepareFilter: options.prepareFilter,
							modifyLoadedData: options.modifyLoadedData
						};

						if (options.tree) {
							filterLookupDataServiceConfig.tree = {parentProp: options.tree.parentProp, childProp: options.tree.childProp};
						}
						dataService = platformLookupDataServiceFactory.createInstance(filterLookupDataServiceConfig).service;

						dataService.getSearchList = getSearchList;
						angular.extend(service, dataService);
					} else {
						if (options.dataServiceName && _.isString(options.dataServiceName)) {
							dataService = $injector.get(options.dataServiceName);
						} else if (options.dataServiceName) {
							dataService = options.dataServiceName;
						}
						if(dataService && !dataService.getSearchList){
							dataService.getSearchList = getSearchList;
						}
						angular.extend(service, dataService);
					}
				
					if (dataService){
						service.dataProvider = {
							getList: function (options) {
								var deferred = $q.defer();

								deferred.resolve(dataService.getList(options));
								return deferred.promise;
							},

							getDefault: function (options) {
								return dataService.getDefault(options);
							},

							getItemById: function (value, options) {
								return dataService.getItemById(value, options);
							},

							getItemByKey: function (value, options) {
								return dataService.getItemById(value, options);
							},

							getSearchList: function (searchRequest, options, scope) {
								return dataService.getSearchList(scope.searchString, scope.settings, {searchFields: searchRequest.SearchFields, searchString: searchRequest.SearchText});
							}	
						};
					}
				
					function setFilter() {
						var result = false;
						var readData = {};
						Object.keys(service.selectedObject).forEach(function (f) {
							readData[f] = service.selectedObject[f];
						});

						if (readData && dataService) {
							dataService.setFilter(readData);
							result = true;
						}
						return result;
					}
				
					service.setOwnFilter = function setOwnFilter(){
						return setFilter();
					};

					service.isUsedFilterSet = function(){
						return true;
					};

					service.getFilterParams = function getFilterParams() {
						var filterParams = {};
						Object.keys(service.selectedObject).forEach(function (f) {
							filterParams[f] = service.selectedObject[f];
						});
						return filterParams;
					};

					function search(data, searchSettings, dataView){
						var result = false;
						var list = [];
						var res = null;
						_.forEach(data, function(item) {
							if(options.tree && item[options.tree.childProp].length > 0){
							// var res = search(item[options.tree.childProp], searchSettings);
								res = search(item[options.tree.childProp], searchSettings, dataView);
								item[options.tree.childProp] = res.list;
								result = res.result;
							}
							var isFound = dataView.matchItem(item, searchSettings);
							if(isFound || (res && res.list && res.list.length > 0) ) {
								list.push(item);
								result = true;
							}
						});
						return {result: result, list: list};
					}

					service.loadSelected = function loadSelected(options) {
						if (dataService) {
							if (service.setOwnFilter()) {
								dataService.getList(options).then(function (list) {
									service.listLoaded.fire(list);
								});
							}
						} else {
							options.dataView.loadData().then(function (list) {
								service.listLoaded.fire(list);
							});
						}
					};

					service.clearSelectionFilter = function clearSelectionFilter(){
						service.selectedObject = {};
						if(dataService) {
							dataService.clearFilter();
						}
					};

					service.load = function load(){
						service.getList(service.options).then(function (list) {
							service.listLoaded.fire(list);
						});
					};

					service.setSelectedFilter = function setSelectedFilter(nameSelected, idSelected) {
						service.selectedObject[nameSelected] = idSelected;
					};

					service.getSelectedFilter = function getSelectedFilter(nameSelected) {
						if (service.selectedObject.hasOwnProperty(nameSelected)) {
							return service.selectedObject[nameSelected];
						}
						return null;
					};
					service.setSelected = function setSelectedItem(selected) {
						if (selectedItem && selected !== selectedItem || _.isNil(selectedItem)) {
							selectedItem = selected;
						// container.service.selectionChanged.fire(selected);
						}
					};
					service.getSelected = function getSelectedItem() {
						return selectedItem;
					};

					/*
				container.service.getItemByKey = function getItemByKey(id) {
					return container.service.getItemById(id, container.options);
				};
*/

					return service;
				}
				return filterService;
			}]);
})(angular);