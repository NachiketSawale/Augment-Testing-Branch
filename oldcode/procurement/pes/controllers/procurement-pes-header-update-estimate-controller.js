(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.contract').controller('procurementPesUpdateEstimateWizardController',
		['$scope', '$modalInstance',  '$translate', 'platformModuleNavigationService', 'procurementPesUpdateEstimateWizardService','prcCommonUpdateEstimateService', 'platformModalService',
			function ($scope, $modalInstance, $translate, naviService, procurementPesUpdateEstimateWizardService, prcCommonUpdateEstimateService, platformModalService) {
				$scope.modalOptions = {
					headerText: $translate.instant('procurement.package.updateEstimate'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					ok: function () {
						var result = prcCommonUpdateEstimateService.setUsingPrcStructures($scope);
						if(!result.valid){
							platformModalService.showMsgBox(result.msg, 'Error', 'error');
							return;
						}
						procurementPesUpdateEstimateWizardService.updateEstimate($scope.UpdateOptions);

						$modalInstance.close({ok: true});
					},
					closeButtonText: $translate.instant('cloud.common.cancel'),
					cancel: function () {
						$modalInstance.close({cancel: true});
					}
				};

				prcCommonUpdateEstimateService.generateScope($scope, 'Pes');

				procurementPesUpdateEstimateWizardService.getUpdateOption().then(function(response){
					if(response && response.data){
						var jobCode = procurementPesUpdateEstimateWizardService.getJobCodeTemp();
						var jobDesc = procurementPesUpdateEstimateWizardService.getJobDescriptionTemp();

						prcCommonUpdateEstimateService.setUpdateOptionValue($scope, jobCode || response.data.JobCodeTemplate, jobDesc || response.data.JobDescriptionTemplate);
					}
				});
			}
		]);
})(angular);