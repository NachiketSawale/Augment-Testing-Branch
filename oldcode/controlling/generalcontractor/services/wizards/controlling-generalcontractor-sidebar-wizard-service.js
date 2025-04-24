(function () {

	'use strict';
	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralContractorSidebarWizardService',
		['globals','$http','_', 'platformModalService', '$translate', '$injector','platformTranslateService','platformSidebarWizardConfigService','platformModalFormConfigService','controllingGeneralContractorCostControlWizardDialogService', 'createAdditionalExpenseWizardDialogService',
			'controllingGeneralContractorBudgetShiftWizardDialogService','controllingGeneralContractorCreateCostControlFrmEstWizardDialogService',
			function (globals,$http,_, platformModalService, $translate, $injector,platformTranslateService,platformSidebarWizardConfigService,platformModalFormConfigService,controllingGeneralContractorCostControlWizardDialogService,createAdditionalExpenseWizardDialogService, controllingGeneralContractorBudgetShiftWizardDialogService,controllingGeneralContractorCreateCostControlFrmEstWizardDialogService) {
				let service = {};

				function createCostControlStructure(creationData){
					$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCSalesContractsController/createCostControlStructure', creationData).then(function (response) {

						if(response &&  response.data){

							if(response.data.timeStr && response.data.timeStr.m_StringValue){
								console.log(response.data.timeStr.m_StringValue);
							}

							if(response.data.result) {
								if (response.data.noDefaultJob) {
									platformModalService.showMsgBox ('controlling.generalcontractor.noDefaultJob', 'cloud.common.informationDialogHeader', 'info');
								} else {
									platformModalService.showMsgBox ('controlling.generalcontractor.WizardResult', 'cloud.common.informationDialogHeader', 'info');
									$injector.get ('controllingGeneralcontractorCostControlDataService').refresh ();
								}
							}
						}

					});
				}

				function createCostControlStructureFrmEst(creationData){
					$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/CostControlController/createCostControlByEstimate', creationData).then(function (response) {

						if(response &&  response.data){
							let result = response.data;

							if(result.TimeStr){
								console.log(result.TimeStr);
							}

							let message = "";

							if(result.Result) {
								message = !!result.InvalidLineItemCodes ? $translate.instant('controlling.generalcontractor.WizardResultWithError',{'invalidLineitemCodes': result.InvalidLineItemCodes}) : 'controlling.generalcontractor.WizardResult';
							}else{
								if (result.HasNoDefaultJob) {
									message = 'controlling.generalcontractor.noDefaultJob';
								}else if(result.HasNoBoqOrCuLinked) {
									message = $translate.instant('controlling.generalcontractor.hasNoBoqOrCuLinked',{'invalidLineitemCodes': result.InvalidLineItemCodes});
								}
							}

							platformModalService.showMsgBox (message, 'cloud.common.informationDialogHeader', 'info');

							if(result.Result){
								$injector.get ('controllingGeneralcontractorCostControlDataService').refresh ();
							}
						}

					});
				}

				service.CreateUpdateCostControlStructure = function CreateUpdateCostControlStructure() {
					if(isNeedRemoveDueDateFilter()){
						return;
					}

					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
					let projectId = projectContext ? projectContext.id :-1;

					if(projectContext) {
						$http.get (globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCSalesContractsController/CheckEstStatusNControllingOfProject?projectId=' + projectId).then (function (response) {

							if (response && response.data.IsReadOnly) {
								platformModalService.showMsgBox ('controlling.generalcontractor.estHeaderIsReadOnly', 'cloud.common.informationDialogHeader', 'info');
								return;
							}

							if (response && !response.data.HasBaseControlling) {
								controllingGeneralContractorCostControlWizardDialogService.resetToDefault();
								controllingGeneralContractorCostControlWizardDialogService.showDialog(function (creationData) {
									createCostControlStructure (creationData);
								});
							} else {
								platformModalService.showMsgBox ('controlling.generalcontractor.currentProjectHasnoCtronlling', 'cloud.common.informationDialogHeader', 'info');
							}
						});
					}else{
						controllingGeneralContractorCostControlWizardDialogService.resetToDefault();
						controllingGeneralContractorCostControlWizardDialogService.showDialog (function (creationData) {
							createCostControlStructure (creationData);
						});
					}
				};


				service.CreateUpdateCostControlStructureFrmEst  = function CreateUpdateCostControlStructureFrmEst(){

					if(isNeedRemoveDueDateFilter()){
						return;
					}

					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
					let projectId = projectContext ? projectContext.id :-1;

					if(projectContext) {
						$http.get (globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCSalesContractsController/CheckEstStatusNControllingOfProject?projectId=' + projectId).then (function (response) {

							if (response && response.data.IsReadOnly) {
								platformModalService.showMsgBox ('controlling.generalcontractor.estHeaderIsReadOnly', 'cloud.common.informationDialogHeader', 'info');
								return;
							}

							if (response && !response.data.HasBaseControlling) {
								controllingGeneralContractorCreateCostControlFrmEstWizardDialogService.resetToDefault();
								controllingGeneralContractorCreateCostControlFrmEstWizardDialogService.showDialog(function (creationData) {
									createCostControlStructureFrmEst (creationData);
								});
							} else {
								platformModalService.showMsgBox ('controlling.generalcontractor.currentProjectHasnoCtronlling', 'cloud.common.informationDialogHeader', 'info');
							}
						});
					}else{
						controllingGeneralContractorCreateCostControlFrmEstWizardDialogService.resetToDefault();
						controllingGeneralContractorCreateCostControlFrmEstWizardDialogService.showDialog (function (creationData) {
							createCostControlStructureFrmEst (creationData);
						});
					}
				};


				service.CreateAdditionalExpenseStructure = function CreateAdditionalExpenseStructure () {
					if(isNeedRemoveDueDateFilter()){
						return;
					}
					createAdditionalExpenseWizardDialogService.resetToDefault();
					createAdditionalExpenseWizardDialogService.showDialog();
				};

				service.GenerateBudgetShift = function GenerateBudgetShift(){
					if(isNeedRemoveDueDateFilter()){
						return;
					}
					controllingGeneralContractorBudgetShiftWizardDialogService.showDialog();
				};

				function CreatePackages(creationData){
					$http.post(globals.webApiBaseUrl + 'procurement/package/package/createOrUpdatePackageByGccWizard', creationData).then(function (response) {
						if(response && response.data){
							let createPackagesWizardDialogService = $injector.get('controllingGeneralContractorCreatePackagesWizardDialogService');
							createPackagesWizardDialogService.setGeneratePackage(response.data);
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + 'controlling.generalcontractor/templates/generate-package-result-page.html'
							});
						}
					});
				}

				service.CreatePackagesWizard = function () {
					if(isNeedRemoveDueDateFilter()){
						return;
					}
					let contractorCostControlDataService =  $injector.get('controllingGeneralcontractorCostControlDataService');
					if(!contractorCostControlDataService.getSelected()){
						platformModalService.showMsgBox('controlling.generalcontractor.NoCostControlSelected', 'cloud.common.informationDialogHeader', 'info');
						return;
					}
					let createPackagesWizardDialogService = $injector.get('controllingGeneralContractorCreatePackagesWizardDialogService');
					createPackagesWizardDialogService.showDialog(function (creationData) {
						CreatePackages(creationData);
					});
				};

				function isNeedRemoveDueDateFilter() {
					let selectedDueDate = $injector.get('controllingGeneralcontractorCostControlDataService').getSelectedDueDate();
					if(selectedDueDate){
						platformModalService.showMsgBox('controlling.generalcontractor.removeDueDate', 'cloud.common.informationDialogHeader', 'info');
					}
					return !!selectedDueDate;
				}

				return service;
			}
		]);
})();
