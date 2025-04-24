/**
 * Created by alm on 30/3/2021.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-unused-vars
	angular.module(moduleName).factory('procurementCommonUpdatePackageBoqService', ['$translate', '$http', 'platformModalService', 'basicsWorkflowWizardContextService', '$q', function ($translate, $http, platformModalService, basicsWorkflowWizardContextService, $q) {
		var service = {};
		service.showUpdatePackageBoqWizardDialog = function (parentService) {
			var serviceName = parentService.getServiceName();

			var selectedLead = basicsWorkflowWizardContextService.getContext().entity;
			selectedLead = selectedLead ? selectedLead : parentService.getSelected();
			var sourceType = '';
			if (serviceName.indexOf('Requisition') !== -1) {
				if (selectedLead === null) {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOneREQ'), 'Info', 'ico-info');
					return;
				}
				sourceType = 'requisition';
			} else if (serviceName.indexOf('Contract') !== -1) {
				if (selectedLead === null) {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOneContract'), 'Info', 'ico-info');
					return;
				}
				sourceType = 'contract';
			} else if (serviceName.indexOf('Quote') !== -1) {
				if (selectedLead === null) {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoSelectOneREQ'), 'Info', 'ico-info');
					return;
				}
				sourceType = 'quote';
			}

			parentService.update();

			var modalOptions = {
				headerTextKey: 'procurement.common.wizard.updatePackageBoq.title',
				templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/update-package-boq.html',
				resizeable: true,
				width: '700px',
				showOKButton: true,
				value: {
					SourceType: sourceType,
					SyncBaseQuantity: false,
					SyncBasePrice: true,
					SyncCostGroups: false,
					UpdateExistItem: false,
					UpdateQuantity: false,
					UpdatePrice: false,
					AddNewItem: true,
					AddQuantity: true,
					AddPrice: false
				}
			};
			return platformModalService.showDialog(modalOptions).then(function (result) {
				if (result.ok) {
					var params = {
						HeaderId: selectedLead.Id,
						SourceType: sourceType,
						Options: {
							IncludeQuantities: result.value.SyncBaseQuantity,
							IncludePrices: result.value.SyncBasePrice,
							IncludeCostGroups: result.value.SyncCostGroups
						},
						QtoOptions: {
							UpdateExistItem: result.value.UpdateExistItem,
							UpdateQuantity: result.value.UpdateQuantity,
							UpdatePrice: result.value.UpdatePrice,
							AddNewItem: result.value.AddNewItem,
							AddQuantity: result.value.AddQuantity,
							AddPrice: result.value.AddPrice,
						}
					};
					return service.updatePackageBoq(params);
				}
				return $q.when('cancel');
			});
		};

		service.updatePackageBoq = function (params) {
			return $http.post(globals.webApiBaseUrl + 'procurement/common/boq/SyncBaseBoQ', params);
		};

		return service;
	}]);

})(angular);
