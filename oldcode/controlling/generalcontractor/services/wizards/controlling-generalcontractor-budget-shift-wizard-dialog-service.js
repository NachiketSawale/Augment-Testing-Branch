(function (angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralContractorBudgetShiftWizardDialogService', ['_', 'platformModalService','$translate', '$injector', 'globals','$http','cloudDesktopPinningContextService',
		function (_, platformModalService, $translate, $injector, globals,$http,cloudDesktopPinningContextService){
			let service = {};

			service.showDialog = function (){

				let costControl = $injector.get('controllingGeneralcontractorCostControlDataService').getSelected();
				if(!costControl){
					platformModalService.showMsgBox($translate.instant('controlling.generalcontractor.NoControlingUnit'), $translate.instant('controlling.generalcontractor.GenerateBudgetShiftTitle'), 'ico-info');
					return;
				}

				let projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
				let searchData = {
					ProjectId: projectContext ? projectContext.id : -1,
					FixRateCheckType: 1
				};

				$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/getProjectCostCodesIsEditable', searchData).then(function (response) {
					if (response && response.data && response.data.noGCCOrderSetting) {
						platformModalService.showMsgBox ('controlling.generalcontractor.noGCCOrderSetting', 'cloud.common.informationDialogHeader', 'info');
						return;
					}

					$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/isExistEstimateHeaderByProject',searchData).then(function (response) {
						if(!response.data){
							platformModalService.showMsgBox($translate.instant('controlling.generalcontractor.NonexistentGCEstimateHeader'), $translate.instant('controlling.generalcontractor.GenerateBudgetShiftTitle'), 'ico-info');
							return;
						}

						$http.get (globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCSalesContractsController/CheckEstStatusNControllingOfProject?projectId=' + searchData.ProjectId).then (function (response) {

							if (response && response.data.IsReadOnly) {
								platformModalService.showMsgBox('controlling.generalcontractor.estHeaderIsReadOnly', 'cloud.common.informationDialogHeader', 'info');
								return;
							}

							platformModalService.showDialog({
								headerText: $translate.instant ('controlling.generalcontractor.GenerateBudgetShiftTitle'),
								templateUrl: globals.appBaseUrl + 'controlling.generalcontractor/templates/generate-budget-shift-dialog-template.html',
								backdrop: false,
								resizeable: true,
								width: '1220px',
								uuid: '5608E17DD28D4B87A108289E9B232385'
							});
						});
					});
				});


			};

			return service;
		}
	]);
})(angular);