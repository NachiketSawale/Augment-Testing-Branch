
(function (angular) {
	/* global  globals, _ */
	'use strict';
	let moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoHeaderProcurementContractLookupDialogService',
		['$http', '$q',
			function ($http, $q) {
				let service = {};

				let lookupData = {
					procurmentContractList: []
				};
				service.loadAsync = function loadAsync() {
					lookupData.ContractListAsyncPromise = getContractList();
					return lookupData.ContractListAsyncPromise.then(function (data) {
						lookupData.ContractListAsyncPromise = null;
						lookupData.procurmentContractList = _.uniq(data, 'Id');
						return lookupData.procurmentContractList;
					});
				};

				function getContractList(searchString){
					let postData = {
						Pattern: searchString ? searchString.SearchText : '',
						ProjectContextId :searchString && searchString.AdditionalParameters ?searchString.AdditionalParameters.ProjectFk:0,
						furtherFilters: [{Token:'FilterOutByPrjChangeStatus', Value: searchString && searchString.AdditionalParameters ?searchString.AdditionalParameters.FilterOutByPrjChangeStatus: false}],
					};

					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'procurement/contract/header/GetLookUpContractsByIsOrdered', postData)
						.then(function (response) {
							let projects =[];
							if(response && response.data){
								projects = response.data;
							}
							deferred.resolve(projects);
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
					if (lookupData.procurmentContractList.length) {
						return $q.when(service.getItemById(value));
					} else {
						let currentContractListAsyncPromise = 'contractListAsyncPromise' + value;
						if (!lookupData[currentContractListAsyncPromise]) {
							lookupData[currentContractListAsyncPromise] = getPrcContractById(value);
						}

						return lookupData[currentContractListAsyncPromise].then(function (data) {
							lookupData[currentContractListAsyncPromise] = null;
							return data;
						});
					}
				};

				function getPrcContractById(value){
					let deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + value).then(function (response) {
						deferred.resolve(response.data);
					});

					return deferred.promise;
				}


				service.getList = function getList() {
					return lookupData.procurmentContractList && lookupData.procurmentContractList.length ? lookupData.procurmentContractList : [];
				};

				service.getItemById = function getItemById(value) {
					let item = {},
						list = lookupData.procurmentContractList;
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