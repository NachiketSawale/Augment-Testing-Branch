(function (angular) {
    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('ppsExternalConfigurationListController', ppsExternalConfigurationListController);

    ppsExternalConfigurationListController.$inject = ['$scope',
        '$injector',
        'platformGridControllerService',
        'ppsExternalConfigurationDataService',
        //'ppsExternalConfigurationUIStandardService',
        'ppsExternalConfigurationValidationService'];

    function ppsExternalConfigurationListController($scope, $injector, platformGridControllerService,
                            dataService,
                            //uiStandardService,
                            validationService) {

        var gridConfig = {
            initCalled: false,
            columns: []
        };
        var uiStandardService = $injector.get('ppsExternalConfigurationUIStandardService');
        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
    }
})(angular);
		