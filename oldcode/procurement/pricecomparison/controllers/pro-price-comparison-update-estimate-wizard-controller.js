
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.pricecomparison').controller('proPriceComparisonUpdateEstimateWizardController',
		['$scope', '$modalInstance',  '$translate', 'platformModuleNavigationService', 'proComparisonWizardUpdateEstimateService','prcCommonUpdateEstimateService','platformModalService',
			function ($scope, $modalInstance, $translate, naviService, proComparisonWizardUpdateEstimateService, prcCommonUpdateEstimateService, platformModalService) {
				$scope.modalOptions = {
					headerText: $translate.instant('procurement.package.updateEstimate'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					ok: function () {
						var result = prcCommonUpdateEstimateService.setUsingPrcStructures($scope);
						if(!result.valid){
							platformModalService.showMsgBox(result.msg, 'Error', 'error');
							return;
						}
						proComparisonWizardUpdateEstimateService.updateEstimate($scope.UpdateOptions);

						$modalInstance.close({ok: true});
					},
					closeButtonText: $translate.instant('cloud.common.cancel'),
					cancel: function () {
						$modalInstance.close({cancel: true});
					}
				};

				prcCommonUpdateEstimateService.generateScope($scope, 'PriceComparison');

				proComparisonWizardUpdateEstimateService.getUpdateOption().then(function(response){
					if(response && response.data){
						var jobCode = proComparisonWizardUpdateEstimateService.getJobCodeTemp();
						var jobDesc = proComparisonWizardUpdateEstimateService.getJobDescriptionTemp();

						prcCommonUpdateEstimateService.setUpdateOptionValue($scope, jobCode || response.data.JobCodeTemplate, jobDesc || response.data.JobDescriptionTemplate);
					}
				});
			}
		]);
})(angular);

