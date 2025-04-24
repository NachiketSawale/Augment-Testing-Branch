/**
 * Created by alm on 8/2/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonReplaceNeutralMaterialService',['$translate','$http','platformModalService','platformWizardDialogService','procurementContextService',function($translate,$http,platformModalService,platformWizardDialogService,moduleContext){
		var service = {};
		service.showReplaceNeutralMaterialWizardDialog=function(parentService){
			var serviceName=parentService.getServiceName();
			var selectedLead= parentService.getSelected();
			if(selectedLead === null){
				if(serviceName.indexOf('Package') !== -1){
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOnePackage'), 'Info', 'ico-info');
				}
				else if(serviceName.indexOf('Requisition') !== -1){
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOneREQ'), 'Info', 'ico-info');
				}
				else if(serviceName.indexOf('Contract') !== -1){
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOneContract'), 'Info', 'ico-info');
				}
				else if(serviceName.indexOf('Quote') !== -1){
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOneQTN'), 'Info', 'ico-info');
				}
				return;
			}
			parentService.update();

			var comanyId=selectedLead.CompanyFk;
			var currentLoginCompanyId=moduleContext.loginCompany;
			if(currentLoginCompanyId!==comanyId){
				platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoCurrentCompany'), 'Info', 'ico-info');
				return;
			}


			var wzConfig = {
				title$tr$: 'procurement.common.wizard.replaceNeutralMaterial.title',
				steps: [{
					id: 'baseOption',
					disallowBack: false,
					disallowNext: false,
					canFinish: false
				},{
					id: 'simulationReplacement',
					disallowBack: false,
					disallowNext: false,
					canFinish: true
				}]
			};

			platformWizardDialogService.translateWizardConfig(wzConfig);
			var catalogItems=[];

			var modalOptions = {
				headerText$tr$: 'procurement.common.wizard.replaceNeutralMaterial.title',
				templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/replace-neutral-material.html',
				resizeable: true,
				width:'700px',
				value: {
					wizard: wzConfig,
					parentService:parentService,
					wizardName: 'wzdlg',
					catalogItems:catalogItems
				},
				showOKButton: true
			};
			platformModalService.showDialog(modalOptions);
		};

		service.getSimulation=function(matchItems){
			return $http.post(globals.webApiBaseUrl + 'procurement/common/replaceNeutralMaterial/getSimulationDatas', matchItems);
		};

		service.goReplace=function(gridData){
			return $http.post(globals.webApiBaseUrl + 'procurement/common/replaceNeutralMaterial/replaceSimulationDatas', gridData);
		};

		service.canReplace=function(param){
			return $http.post(globals.webApiBaseUrl + 'procurement/common/replaceNeutralMaterial/canReplaceDatas', param);
		};

		service.getHomePrice = function (materialId, prcItemId) {
			return $http.get(globals.webApiBaseUrl + 'procurement/common/replaceNeutralMaterial/getHomePrice?materialId=' + materialId + '&prcItemId=' + prcItemId);
		};
		return service;
	}]);

})(angular);