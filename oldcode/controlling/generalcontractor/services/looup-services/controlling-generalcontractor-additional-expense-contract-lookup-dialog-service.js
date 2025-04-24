
(function (angular) {
	'use strict';
	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).factory('additionalExpenseContractLookupDialogService',
		['_','globals','$http', '$q', 'cloudDesktopPinningContextService', 'controllingGeneralcontractorCostControlDataService',
			function (_,globals,$http, $q, cloudDesktopPinningContextService,controllingGeneralcontractorCostControlDataService) {
				let service = {};

				let lookupData = {
					additionalExpenseContractList:[]
				};

				service.loadAsync = function loadAsync() {
					lookupData.ContractListAsyncPromise = getContractList();
					return lookupData.ContractListAsyncPromise.then(function (data) {
						lookupData.ContractListAsyncPromise = null;
						lookupData.additionalExpenseContractList = _.uniq(data, 'Id');
						return lookupData.additionalExpenseContractList;
					});
				};

				function getContractList(searchString){
					let postData = {};
					if(searchString){
						let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
						let projectId=-1;
						let mdcControllingUnitFk = -1;
						if(projectContext){
							projectId = projectContext.id;
						}

						let mdcControllingUnit = controllingGeneralcontractorCostControlDataService.getSelected();
						if(mdcControllingUnit){
							mdcControllingUnitFk =Math.abs(mdcControllingUnit.Id);
						}

						postData = {
							Filter: searchString,
							ProjectId:projectId,
							MdcControllingUnitFk:mdcControllingUnitFk
						};
					}
					else {
						postData = {
							Filter: '',
							ProjectId:-1,
							MdcControllingUnitFk:-1
						};
					}
					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'procurement/contract/conheaderlookup/getlistforgcadditionalexpensecontract?filterValue', postData)
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

				service.getList = function getList() {
					return lookupData.additionalExpenseContractList && lookupData.additionalExpenseContractList.length ? lookupData.additionalExpenseContractList : [];
				};

				service.getSearchList = function getSearchList(searchRequest) {
					return getContractList(searchRequest);
				};

				return service;
			}]);
} )(angular);