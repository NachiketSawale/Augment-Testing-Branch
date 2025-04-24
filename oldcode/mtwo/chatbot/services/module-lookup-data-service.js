(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).factory('moduleLookupDataService',
		['$http', '$q', '_',
			function ($http, $q, _) {
				var service = {};

				var lookupData = {
					moduleDataList: []
				};
				service.loadAsync = function loadAsync() {
					if (!lookupData.moduleListAsyncPromise) {
						lookupData.moduleListAsyncPromise = getModuleDataList();
					}
					return lookupData.moduleListAsyncPromise.then(function (data) {
						lookupData.moduleListAsyncPromise = null;
						lookupData.moduleDataList = _.uniq(data, 'Id');
						return lookupData.moduleDataList;
					});
				};

				function getModuleDataList() {
					var deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'mtwo/chatbot/header/module')
						.then(function (response) {
							if (response && response.data) {
								// add emptyvalue
								response.data.unshift({Id: null,Description: {Description: ' ', DescriptionTr: 2933}});
								lookupData.moduleDataList = response.data;
							}
							deferred.resolve(lookupData.moduleDataList);
						});

					return deferred.promise;
				}

				service.getListAsync = function getListAsync() {
					var list = service.getList();
					if (list && list.length > 0) {
						return $q.when(list);
					} else {
						return service.loadAsync();
					}
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					if (lookupData.moduleDataList.length) {
						return $q.when(service.getItemById(value));
					} else {

						if (!lookupData.moduleListAsyncPromise) {
							lookupData.moduleListAsyncPromise = getModuleDataList();
						}
						return lookupData.moduleListAsyncPromise.then(function () {
							lookupData.moduleListAsyncPromise = null;
							return service.getItemById(value);
						});
					}


				};
				service.getList = function getList() {
					return lookupData.moduleDataList && lookupData.moduleDataList.length ? lookupData.moduleDataList : [];
				};

				service.getLookupData = function getLookupData() {
					return getModuleDataList();
				};
				service.getItemById = function getItemById(value) {
					var item = {},
						list = lookupData.moduleDataList;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
					}
					return item && item.Id ? item : null;
				};

				service.getSearchList = function getSearchList(searchvalue) {
					let searchRs = [];
					if (!lookupData.moduleListAsyncPromise) {
						lookupData.moduleListAsyncPromise = getModuleDataList();
					}
					return lookupData.moduleListAsyncPromise.then(function (data) {
						lookupData.moduleDataList = _.uniq(data, 'Id');
						if (searchvalue) {
							let list = lookupData.moduleDataList;
							if(list.length >=1) {
								for( var i=0; i< list.length; i++) {
									var oregular = new RegExp(searchvalue,'i');
									if(!_.isNil(list[i].Description.Description) && list[i].Description.Description.search(oregular) !== -1) {
										searchRs.push(list[i]);
									}
								}
							}
						} else {
							searchRs = data;
						}
						return searchRs;
					});
				};

				return service;
			}]);
})(angular);
