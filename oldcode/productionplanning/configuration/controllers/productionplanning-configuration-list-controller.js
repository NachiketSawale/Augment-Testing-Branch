(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationListController', productionplanningConfigurationListController);

    productionplanningConfigurationListController.$inject = ['$scope', 'platformGridControllerService',
        'productionplanningConfigurationMainService',
        'productionplanningConfigurationUIStandardService',
        'productionplanningConfigurationValidationService'];

    function productionplanningConfigurationListController($scope, platformGridControllerService,
                            dataService,
                            uiStandardService,
                            validationService) {

        var gridConfig = {
            initCalled: false,
            columns: []
        };

        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
    }
})(angular);
		