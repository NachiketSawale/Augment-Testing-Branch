
(function (angular) {
	/* global  globals, _ */
	'use strict';
	var moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoHeaderPackageLookupDialogService',
		['$http', '$q','$injector',
			function ($http, $q,$injector) {
				var service = {};

				var lookupData = {
					packageList: []
				};

				service.clear = function clear(){
					lookupData.packageList = [];
				};

				service.loadAsync = function loadAsync() {
					lookupData.packageListAsyncPromise = getPackages();
					return lookupData.packageListAsyncPromise.then(function (data) {
						lookupData.packageListAsyncPromise = null;
						lookupData.packageList = _.uniq(data, 'Id');
						return lookupData.packageList;
					});
				};

				function  getPackages(searchString){
					var dataItem = $injector.get('qtoMainHeaderCreateDialogDataService').getDataItem();
					var postData = {
						Pattern: searchString ? searchString.SearchText : '',
						ProjectContextId: dataItem ? dataItem.ProjectFk : 0
					};

					var deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'procurement/package/package/GetPackageWithBusinessPartner',postData)
						.then(function (response) {
							var packages =[];
							if(response && response.data){
								packages =  lookupData.packageList = _.uniq(response.data, 'Id');
							}
							deferred.resolve(packages);
						});

					return deferred.promise;
				}

				service.getListAsync = function getListAsync() {
					var list = service.getList();
					if (list && list.length > 0) {
						return $q.when(list);
					}
					else {
						return service.loadAsync();
					}
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					if (lookupData.packageList.length) {
						return $q.when(service.getItemById(value));
					} else {
						if (!lookupData.packageListAsyncPromise) {
							lookupData.packageListAsyncPromise = service.getListAsync();
						}
						return lookupData.packageListAsyncPromise.then(function (data) {
							lookupData.packageListAsyncPromise = null;
							lookupData.packageList = data;
							return service.getItemById(value);
						});
					}
				};


				service.getList = function getList() {
					return lookupData.packageList && lookupData.packageList.length ? lookupData.packageList : [];
				};

				service.getItemById = function getItemById(value) {
					var item = {},
						list = lookupData.packageList;
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

				service.getSearchList = function getSearchList(searchRequest,entitiy) {
					return getPackages(searchRequest,entitiy);
				};

				return service;
			}]);
} )(angular);