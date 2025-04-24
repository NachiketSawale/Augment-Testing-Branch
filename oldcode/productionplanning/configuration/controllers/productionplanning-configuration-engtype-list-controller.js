(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationEngtypeListController', ListController);

    ListController.$inject = ['$scope', 'platformGridControllerService',
        'productionplanningConfigurationEngtypeDataService',
        'productionplanningConfigurationEngtypeUIStandardService',
        'productionplanningConfigurationEngtypeValidationService'];

    function ListController($scope, platformGridControllerService,
                            dataService,
                            uiStandardService,
                            validationService) {

        var gridConfig = {
            initCalled: false,
            columns: [],
            type: 'EngTypeList'
        };

        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
    }
})(angular);
		