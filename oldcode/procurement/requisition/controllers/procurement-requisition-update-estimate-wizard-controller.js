

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.requisition').controller('procurementRequisitionUpdateEstimateWizardController',
		['$scope', '$modalInstance',  '$translate', 'platformModuleNavigationService', 'procurementRequisitionWizardUpdateEstimateService','prcCommonUpdateEstimateService','platformModalService',
			function ($scope, $modalInstance, $translate, naviService, procurementRequisitionWizardUpdateEstimateService, prcCommonUpdateEstimateService, platformModalService) {
				$scope.modalOptions = {
					headerText: $translate.instant('procurement.package.updateEstimate'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					ok: function () {
						let result = prcCommonUpdateEstimateService.setUsingPrcStructures($scope);
						if(!result.valid){
							platformModalService.showMsgBox(result.msg, 'Error', 'error');
							return;
						}
						procurementRequisitionWizardUpdateEstimateService.updateEstimate($scope.UpdateOptions);

						$modalInstance.close({ok: true});
					},
					closeButtonText: $translate.instant('cloud.common.cancel'),
					cancel: function () {
						$modalInstance.close({cancel: true});
					}
				};

				prcCommonUpdateEstimateService.generateScope($scope, 'Requisition');

				procurementRequisitionWizardUpdateEstimateService.getUpdateOption().then(function(response){
					if (response?.data) {
						let jobCode = procurementRequisitionWizardUpdateEstimateService.getJobCodeTemp();
						let jobDesc = procurementRequisitionWizardUpdateEstimateService.getJobDescriptionTemp();

						prcCommonUpdateEstimateService.setUpdateOptionValue($scope, jobCode || response.data.JobCodeTemplate, jobDesc || response.data.JobDescriptionTemplate);
					}
				});
			}
		]);
})(angular);

