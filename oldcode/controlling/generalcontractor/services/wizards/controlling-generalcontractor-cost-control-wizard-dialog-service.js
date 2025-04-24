(function () {
	'use strict';
	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).factory('controllingGeneralContractorCostControlWizardDialogService', ['globals', 'PlatformMessenger', '$http', '$q','_', '$injector', '$translate', 'platformModalService', 'platformDataValidationService', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupFilterService',
		function (globals, PlatformMessenger, $http,$q, _, $injector, $translate, platformModalService, platformDataValidationService, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, cloudDesktopPinningContextService, basicsLookupdataLookupFilterService) {

			let service = {};
			let initDataItem = {};
			let projectContext = {};
			service.showSalesContractStatusInfo = new PlatformMessenger();

			service.resetToDefault = function init() {
				projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
				initDataItem = {
					ProjectFk: null,
					Comment: null,
					ContractHelper: null
				};

				if (projectContext) {
					initDataItem.ProjectFk = projectContext.id;
				}
			};
			service.resetToDefault();
			
			let contractList =[];
			service.getList = function getList(){
				return contractList;
			};

			service.getContractsFromServer = function getContractsFromServer(fromWizard) {
				let salesContractsDataService =  $injector.get('controllingGeneralContractorSalesContractsDataService');
				let selectedContracts = salesContractsDataService.getSelectedEntities();

				let redHintsContracts = salesContractsDataService.getList();
				redHintsContracts = _.filter(redHintsContracts,{'Flag':'2'});
				selectedContracts = selectedContracts.concat(redHintsContracts);

				projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
				let postData ={
					Filter: '',
					PrjBoqFk: -1,
					ProjectId: projectContext ? projectContext.id :-1,
					IsFilterByConStatus: true,
					CheckFlag: fromWizard
				};
				let deferred = $q.defer();

				$http.post(globals.webApiBaseUrl + 'sales/contract/getlistforgcsalescontract?filterValue', postData)
					.then(function (response) {
						let contracts =[];
						if(response && response.data){
							contracts = response.data;
						}
						if(selectedContracts && selectedContracts.length){
							_.forEach(contracts,function (d) {
								let con = _.find(selectedContracts,{'Id':d.Id});
								if(con){
									d.IsMarked = true;
								}

							});
						}
						contractList  =contracts;
						deferred.resolve(contracts);
						return deferred.promise;
					});
				return deferred.promise;
			};

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'gcc-sales-contracts-contract-filter',
					fn: function (contract, entity) {
						return entity.ProjectFk;
					}
				}
			]);

			service.showDialog = function showDialog(onCreateFn) {
				projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
				service.resetToDefault();

				let searchData = {
					ProjectId: projectContext ? projectContext.id : -1,
					FixRateCheckType: 1
				};

				$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/getProjectCostCodesIsEditable', searchData).then(function (response) {
					if (response && response.data) {
						if(response.data.noGCCOrderSetting){
							platformModalService.showMsgBox('controlling.generalcontractor.noGCCOrderSetting', 'cloud.common.informationDialogHeader', 'info');
						}else if (response.data.fixedRate) {
							platformModalService.showMsgBox('controlling.generalcontractor.IsFixRate', 'cloud.common.informationDialogHeader', 'info');
						}else {

							let config = {
								title: $translate.instant ('controlling.generalcontractor.CreateUpdateCostControlStructureWizard'),
								dataItem: initDataItem,
								handleOK: function handleOK(result) {
									let creationData = {
										ProjectFk: projectContext ? projectContext.id : -1,
										Comment: result.data.Comment,
										ContractHelper: result.data.ContractHelper
									};

									if (_.isFunction (onCreateFn)) {
										onCreateFn (creationData);
									}
								}
							};

							let headerText = $translate.instant ('controlling.generalcontractor.CreateUpdateCostControlStructureWizard');

							platformModalService.showDialog ({
								headerText: $translate.instant (headerText),
								dataItem: initDataItem,
								templateUrl: globals.appBaseUrl + 'controlling.generalcontractor/templates/create-update-cost-control-dialog-template.html',
								backdrop: false,
								resizeable: true,
								width: '900px',
								uuid: '044C425CFD6B45018CBE61A3FDD2DD6D'

							}).then (function (result) {
								if (result.ok) {
									config.handleOK (result);
								} else {
									if (config.handleCancel) {
										config.handleCancel (result);
									}
								}
							}
							);

						}
					}
				});
			};

			return service;

		}]);
})();
