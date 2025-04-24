
(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).factory('controllingGeneralContractorSalesContractLookupDialogService',
		['$http', '$q','cloudDesktopPinningContextService',
			function ($http, $q,cloudDesktopPinningContextService) {
				let service = {};

				let lookupData = {
					salesContractList: []
				};
				service.loadAsync = function loadAsync() {
					lookupData.ContractListAsyncPromise = getContractList();
					return lookupData.ContractListAsyncPromise.then(function (data) {
						lookupData.ContractListAsyncPromise = null;
						lookupData.salesContractList = _.uniq(data, 'Id');
						return lookupData.salesContractList;
					});
				};

				function getContractList(searchString){
					let postData = {};
					if(searchString){
						let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
						let projectId=-1;
						if(projectContext){
							projectId = projectContext.id;
						}

						postData = {
							Filter: searchString,
							PrjBoqFk: -1,
							ProjectId:projectId,
							IsFilterByConStatus:true
						};
					}
					else {
						postData = {
							Filter: '',
							PrjBoqFk: 0,
							ProjectId:-1
						};
					}
					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'sales/contract/getlistforgcsalescontract?filterValue', postData)
						.then(function (response) {
							let projects =[];
							if(response && response.data){
								projects = response.data;
							}
							deferred.resolve(projects);
							return deferred.promise;
						});
					return deferred.promise;
				}

				service.getListAsync = function getListAsync() {
					let list = service.getList();
					if (list && list.length > 0) {
						return $q.when(list);
					}
					else {
						return service.loadAsync();
					}
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					if (lookupData.salesContractList.length) {
						return $q.when(service.getItemById(value));
					} else {
						let currentContractListAsyncPromise = 'contractListAsyncPromise' + value;
						if (!lookupData[currentContractListAsyncPromise]) {
							lookupData[currentContractListAsyncPromise] = getContractById(value);
						}

						return lookupData[currentContractListAsyncPromise].then(function (data) {
							lookupData[currentContractListAsyncPromise] = null;
							return data;
						});
					}
				};

				function getContractById(value){
					let deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'sales/contract/byid?id=' + value).then(function (response) {
						deferred.resolve(response.data);
					});

					return deferred.promise;
				}


				service.getList = function getList() {
					return lookupData.salesContractList && lookupData.salesContractList.length ? lookupData.salesContractList : [];
				};

				service.getItemById = function getItemById(value) {
					let item = {},
						list = lookupData.salesContractList;
					if (list && list.length > 0) {
						for (let i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								item = list[i];
								break;
							}
						}
					}
					return item && item.Id ? item : null;
				};

				service.getSearchList = function getSearchList(searchRequest) {
					return getContractList(searchRequest);
				};

				return service;
			}]);
} )(angular);