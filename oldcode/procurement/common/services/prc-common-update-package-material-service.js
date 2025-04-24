/**
 * Created by Any.Xu on 22/8/2024.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-unused-vars
	angular.module(moduleName).factory('procurementCommonUpdatePackageMaterialService',
		['$translate', '$http', 'platformModalService', 'basicsWorkflowWizardContextService', 'procurementContextService', 'procurementCommonPrcItemDataService',
			function ($translate, $http, platformModalService, basicsWorkflowWizardContextService, moduleContext, prcItemDataServiceFactory) {
		let service = {};
		service.updatePackageWithAdditionalItems = function (parentService) {
			let contextLead = basicsWorkflowWizardContextService.getContext().entity;
			let selectedLead = contextLead ? contextLead : parentService.getSelected();

			if(!selectedLead.PackageFk){
				platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updatePackageMaterial.errorNoPackageAssigned'), 'Info', 'ico-info');
				return;
			}

			parentService.update();

			let params = {
				HeaderId: selectedLead.Id,
				SourceType: 'requisition',
			};

			service.updatePackageMaterial(params).then(function (response) {
			   let res = response.data;
				if(res.ToUpdateCount > 0) {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updatePackageMaterial.updatePackageSuccess'), 'Info', 'ico-info').then(function (response) {
						// load updated items if the current selected entity still is the processed entity.
						let curSelected = parentService.getSelected();
						if (curSelected && curSelected.Id === selectedLead.Id) {
							let mainService = moduleContext.getMainService();
							let prcItemDataService = prcItemDataServiceFactory.getService(mainService);
							prcItemDataService.loadSubItemsList();
						}
					})
				} else {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updatePackageMaterial.errorNoAdditionalItems'), 'Info', 'ico-info');
				}
			})
		};

		service.updatePackageMaterial = function (params) {
			return $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/updatePackageMaterial', params);
		};

		return service;
	}]);

})(angular);
