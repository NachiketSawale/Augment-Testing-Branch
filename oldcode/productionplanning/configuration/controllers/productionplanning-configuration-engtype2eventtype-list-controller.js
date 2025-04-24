(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationEngtype2eventtypeListController', ListController);

    ListController.$inject = ['$scope', 'platformGridControllerService',
        'productionplanningConfigurationEngtype2eventtypeDataService',
        'productionplanningConfigurationEngtype2eventtypeUIStandardService',
        'productionplanningConfigurationEngtype2eventtypeValidationService'];

    function ListController($scope, platformGridControllerService,
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
		