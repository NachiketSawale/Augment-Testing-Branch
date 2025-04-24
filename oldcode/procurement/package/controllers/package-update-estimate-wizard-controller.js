/**
 * Created by wul on 6/25/2018.
 */

(function (angular) {
    'use strict';

    /* jshint -W072 */ // many parameters because of dependency injection
    angular.module('procurement.package').controller('packageUpdateEstimateWizardController',
        ['$scope', '$modalInstance', '$translate', 'platformModuleNavigationService', 'prcCommonWizardUpdateEstimateService', 'prcCommonUpdateEstimateService', 'platformModalService', '$injector',
            function ($scope, $modalInstance, $translate, naviService, prcCommonWizardUpdateEstimateService, prcCommonUpdateEstimateService, platformModalService, $injector) {
                $scope.modalOptions = {
                    headerText: $translate.instant('procurement.package.updateEstimate'),
                    actionButtonText: $translate.instant('cloud.common.ok'),
                    ok: function () {
                        var result = prcCommonUpdateEstimateService.setUsingPrcStructures($scope);
                        if (!result.valid) {
                            platformModalService.showMsgBox(result.msg, 'Error', 'error');
                            return;
                        }

						$modalInstance.close({ok: true});
                        return prcCommonWizardUpdateEstimateService.updateEstimate($scope.UpdateOptions).then(function (res) {
                            $injector.get('basicsWorkflowWizardContextService').setResult(res);
                        });


                    },
                    closeButtonText: $translate.instant('cloud.common.cancel'),
                    cancel: function () {
                        $modalInstance.close({cancel: true});
                    }
                };

                prcCommonUpdateEstimateService.generateScope($scope, 'Package');

                prcCommonWizardUpdateEstimateService.getUpdateOption().then(function (response) {
                    if (response && response.data) {
                        var jobCode = prcCommonWizardUpdateEstimateService.getJobCodeTemp();
                        var jobDesc = prcCommonWizardUpdateEstimateService.getJobDescriptionTemp();

                        prcCommonUpdateEstimateService.setUpdateOptionValue($scope, jobCode || response.data.JobCodeTemplate, jobDesc || response.data.JobDescriptionTemplate);
                    }
                });
            }
        ]);
})(angular);

