(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationUpstreamItemTemplateListController', ListController);

    ListController.$inject = ['$scope', 'platformGridControllerService',
        'ppsConfigurationUpstreamItemTemplateDataService',
        'ppsUpstreamItemTemplateUIStandardService',
        'ppsUpstreamTemplateValidationService'];

    function ListController($scope, platformGridControllerService,
                            dataService,
                            uiStandardService,
                            validationService) {

        var gridConfig = {
            initCalled: false,
            columns: [],
            type: 'PpsUpstreamItemTemplate'
        };

        platformGridControllerService.initListController($scope, uiStandardService.getService(dataService), dataService, validationService.getService(dataService), gridConfig);
    }
})(angular);
