
(function (angular) {
	/* global  globals, _ */
	'use strict';
	var moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoHeaderProjectLookupDialogService',
		['$http', '$q','$injector','basicsLookupdataLookupDescriptorService',
			function ($http, $q,$injector,basicsLookupdataLookupDescriptorService) {
				var service = {};

				var lookupData = {
					prjList: [],
					prjListByKey: []
				};
				service.loadAsync = function loadAsync() {
					lookupData.prjListAsyncPromise = getProjects();
					return lookupData.prjListAsyncPromise.then(function (data) {
						lookupData.prjListAsyncPromise = null;
						lookupData.prjList = _.uniq(data, 'Id');
						return lookupData.prjList;
					});
				};

				function  getProjects(searchString){
					var dataItem = $injector.get('qtoMainHeaderCreateDialogDataService').getDataItem();
					var postData = {
						Pattern: searchString ? searchString.SearchText : '',
						QtoTargetType: dataItem ? dataItem.QtoTargetType : 0
					};

					var deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'project/main/GetProjectOfBPContract',postData)
						.then(function (response) {
							var projects =[];
							if(response && response.data){
								projects = response.data.dtos;
								basicsLookupdataLookupDescriptorService.updateData('ProjectOfBPContract',projects);
							}
							deferred.resolve(projects);
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
					if (lookupData.prjList.length) {
						return $q.when(service.getItemById(value));
					} else {
						var currentPrjListAsyncPromise = 'prjListAsyncPromise' + value;
						if (!lookupData[currentPrjListAsyncPromise]) {
							lookupData[currentPrjListAsyncPromise] = getProjectById(value);
						}

						return lookupData[currentPrjListAsyncPromise].then(function (data) {
							lookupData[currentPrjListAsyncPromise] = null;
							return data;
						});
					}
				};

				function  getProjectById(value){
					var deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'project/main/byid?id=' + value).then(function (response) {
						deferred.resolve(response.data);
					});

					return deferred.promise;
				}


				service.getList = function getList() {
					return lookupData.prjList && lookupData.prjList.length ? lookupData.prjList : [];
				};

				service.getItemById = function getItemById(value) {
					var item = {},
						list = lookupData.prjList;
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
					return getProjects(searchRequest,entitiy);
				};

				return service;
			}]);
} )(angular);