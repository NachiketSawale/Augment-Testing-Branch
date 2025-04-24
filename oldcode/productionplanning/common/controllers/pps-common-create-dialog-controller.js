(function (angular) {
    // eslint-disable-next-line no-redeclare
    /* global angular,_ */
    'use strict';

    angular.module('productionplanning.common').controller('productionplanningCommonCreateDialogController',
        ['$scope', 'productionplanningCommonCreateDialogConfigService', 'globals',

            function ($scope, dialogConfigService, globals) {
                $scope.path = globals.appBaseUrl;
                $scope.dataItem = dialogConfigService.getDataItem();

                const formConfig = dialogConfigService.getFormConfiguration();

                $scope.formOptions = {
                    configure: formConfig
                };

                $scope.formContainerOptions = {
                    formOptions: $scope.formOptions,
                    setTools: function () {
                    }
                };

                function getButtonById(id) {
                    return $scope.dialog.getButtonById(id);
                }

                let okButton = getButtonById('ok');
                okButton.fn = function () {
                    dialogConfigService.assertAllValid($scope).then(function (passValidation) {
                        if (passValidation) {
                            $scope.$close({ok: true, data: $scope.dataItem});
                        }
                    });
                };

                okButton.disabled = function () {
                    //return !!($scope.dataItem.__rt$data && $scope.dataItem.__rt$data.errors && _.size($scope.dataItem.__rt$data.errors) > 0);

                    var hasError = false;
                    if ($scope.dataItem.__rt$data && $scope.dataItem.__rt$data.errors) {
                        for (let prop in $scope.dataItem.__rt$data.errors) {
                            if (!Object.prototype.hasOwnProperty.call($scope.dataItem.__rt$data.errors, prop)) {
                                continue;
                            }
                            if ($scope.dataItem.__rt$data.errors[prop]) {
                                hasError = true;
                                break;
                            }
                        }
                    }
                    let dataService = dialogConfigService.getDataService();
                    if(!hasError && dataService && dataService.isOkDisable){
                        hasError = dataService.isOkDisable();
                    }
                    return hasError;
                };

                let cancelButton = getButtonById('cancel');
                cancelButton.fn = function () {
                    $scope.$close({});
                };
            }
        ]);
})(angular);
