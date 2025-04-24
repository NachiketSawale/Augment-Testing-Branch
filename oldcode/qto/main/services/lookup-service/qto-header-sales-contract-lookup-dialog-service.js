
(function (angular) {
	/* global  globals, _ */
	'use strict';
	var moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoHeaderSalesContractLookupDialogService',
		['$http', '$q','basicsLookupdataLookupFilterService','$injector','cloudDesktopPinningContextService',
			function ($http, $q,basicsLookupdataLookupFilterService,$injector,cloudDesktopPinningContextService) {
				let service = {};

				let lookupData = {
					salesContractList: []
				};

				let projectId =0;

				service.setProjectId = function (value) {
					lookupData.ContractListAsyncPromise = null;
					projectId = value;
				};

				service.loadAsync = function loadAsync() {
					lookupData.ContractListAsyncPromise = getContractList();
					return lookupData.ContractListAsyncPromise.then(function (data) {
						lookupData.ContractListAsyncPromise = null;
						lookupData.salesContractList = _.uniqBy(lookupData.salesContractList.concat(data), 'Id');
						return data;
					});
				};

				function getContractList(searchString, displayMember, entity) {
					let postData = {Filter: searchString};

					let isQtoLine = entity ? !!entity.QtoHeaderFk : false;
					if (isQtoLine) {
						if (entity.BillToFk) {
							postData.BillToFk = entity.BillToFk;
						}

						if (entity.BoqItemFk){
							postData.PrjBoqFk = entity.BoqItemFk;
							postData.IncludeRelatedHeader = false;
						}
					} else if (entity) {
						postData.PrjBoqFk = _.toInteger(entity.PrjBoqFk);
						postData.IncludeRelatedHeader = false;
					}

					postData.WipHeaderFk = entity ? entity.WipHeaderFk: null;
					postData.BilHeaderFk = entity ? entity.BilHeaderFk: null;

					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'sales/contract/GetSalesContractByPortal', postData)
						.then(function (response) {
							let contracts = [];
							if (response && response.data) {
								contracts = response.data;
								lookupData.salesContractList = _.uniqBy(lookupData.salesContractList.concat(contracts), 'Id');
							}
							deferred.resolve(contracts);
						});

					return deferred.promise;
				}

				service.getListAsync = function getListAsync() {
					return service.loadAsync();
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					let item = service.getItemById(value);

					let context = cloudDesktopPinningContextService.getContext();
					let contextProjectInfo = _.find(context, {token: 'project.main'});
					if (contextProjectInfo && contextProjectInfo.id && angular.isNumber(contextProjectInfo.id)) {
						projectId = contextProjectInfo.id;
					}
					if (item) {
						return $q.when(item);
					} else {
						if (!lookupData.ContractListAsyncPromise) {

							let filterString = '(CompanyFk=' + $injector.get ('platformContextService').getContext ().clientId + ') and (ProjectFk=' + projectId + ')';
							if(!projectId){
								filterString = '(CompanyFk=' + $injector.get ('platformContextService').getContext ().clientId+ ')';
							}

							lookupData.ContractListAsyncPromise = getContractList(filterString);
						}

						return lookupData.ContractListAsyncPromise.then(function (data) {
							lookupData.ContractListAsyncPromise = null;
							lookupData.salesContractList = _.uniqBy(lookupData.salesContractList.concat(data), 'Id');
							return service.getItemById(value);
						});
					}
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

				service.getContractById = function(contractId){
					return $http.get(globals.webApiBaseUrl + 'sales/contract/byid?id=' + contractId).then(function (response) {
						return response.data;
					});
				};

				service.getSearchList = function getSearchList(searchRequest,displayMember,entity) {
					return getContractList(searchRequest,displayMember,entity);
				};

				return service;
			}]);
} )(angular);