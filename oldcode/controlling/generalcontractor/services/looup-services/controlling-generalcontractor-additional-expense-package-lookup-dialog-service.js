
(function (angular) {
	'use strict';
	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).factory('additionalExpensePackageLookupDialogService',
		['_','globals','$http', '$q', 'cloudDesktopPinningContextService', 'controllingGeneralcontractorCostControlDataService',
			function (_,globals,$http, $q, cloudDesktopPinningContextService,controllingGeneralcontractorCostControlDataService) {
				let service = {};

				let lookupData = {
					additionalExpensePackageList:[]
				};

				service.loadAsync = function loadAsync() {
					lookupData.ContractListAsyncPromise = getContractList();
					return lookupData.ContractListAsyncPromise.then(function (data) {
						lookupData.ContractListAsyncPromise = null;
						lookupData.additionalExpensePackageList = _.uniq(data, 'Id');
						return lookupData.additionalExpensePackageList;
					});
				};

				function getContractList(searchString){
					let postData = {};
					if(searchString){
						let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
						let PrjProjectFk=-1;
						let MdcControllingUnitFk = -1;
						if(projectContext){
							PrjProjectFk = projectContext.id;
						}
						if(controllingGeneralcontractorCostControlDataService.getSelected()){
							MdcControllingUnitFk = Math.abs(controllingGeneralcontractorCostControlDataService.getSelected().Id);
						}

						postData = {
							Filter: searchString,
							PrjProjectFk:PrjProjectFk,
							MdcControllingUnitFk:MdcControllingUnitFk
						};
					}
					else {
						postData = {
							Filter: '',
							PrjProjectFk:-1,
							MdcControllingUnitFk:-1
						};
					}
					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'procurement/package/package/getlistforgcadditionalexpensepackage?filterValue', postData)
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
					return lookupData.additionalExpensePackageList && lookupData.additionalExpensePackageList.length ? lookupData.additionalExpensePackageList : [];
				};

				service.getSearchList = function getSearchList(searchRequest) {
					return getContractList(searchRequest);
				};

				return service;
			}]);
} )(angular);