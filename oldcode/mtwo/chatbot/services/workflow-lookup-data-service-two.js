(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).factory('workflowLookupDataServiceTwo',
		['$http', '$q', '_',
			function ($http, $q, _) {
				var service = {};

				var lookupData = {
					workflowDataList: []
				};
				service.loadAsync = function loadAsync() {
					if (!lookupData.WorkflowListAsyncPromise) {
						lookupData.WorkflowListAsyncPromise = getWorkflowDataList();
					}
					return lookupData.WorkflowListAsyncPromise.then(function (data) {
						lookupData.WorkflowListAsyncPromise = null;
						lookupData.workflowDataList = _.uniq(data, 'Id');
						return lookupData.workflowDataList;
					});
				};

				function getWorkflowDataList() {
					var deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'mtwo/chatbot/wf2intent/bycontext')
						.then(function (response) {
							if (response && response.data) {
								// add emptyvalue
								response.data.unshift({Id: null,Description: ''});
								lookupData.workflowDataList = response.data;
							}
							deferred.resolve(lookupData.workflowDataList);
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
					if (lookupData.workflowDataList.length) {
						return $q.when(service.getItemById(value));
					} else {

						if (!lookupData.WorkflowListAsyncPromise) {
							lookupData.WorkflowListAsyncPromise = getWorkflowDataList();
						}
						return lookupData.WorkflowListAsyncPromise.then(function () {
							lookupData.WorkflowListAsyncPromise = null;
							return service.getItemById(value);
						});
					}


				};
				service.getList = function getList() {
					return lookupData.workflowDataList && lookupData.workflowDataList.length ? lookupData.workflowDataList : [];
				};

				service.getLookupData = function getLookupData() {
					return getWorkflowDataList();
				};

				service.getItemById = function getItemById(value) {
					var item = {},
						list = lookupData.workflowDataList;
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
					if (!lookupData.WorkflowListAsyncPromise) {
						lookupData.WorkflowListAsyncPromise = getWorkflowDataList();
					}
					return lookupData.WorkflowListAsyncPromise.then(function (data) {
						lookupData.workflowDataList = _.uniq(data, 'Id');
						if (searchvalue) {
							let list = lookupData.workflowDataList;
							if(list.length >=1) {
								for (var i = 0; i < list.length; i++) {
									var oregular = new RegExp(searchvalue, 'i');
									if((!_.isNil(list[i].Description) && list[i].Description.search(oregular) !== -1) || (!_.isNil(list[i].Kind) && list[i].Kind.search(oregular) !== -1)) {
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
