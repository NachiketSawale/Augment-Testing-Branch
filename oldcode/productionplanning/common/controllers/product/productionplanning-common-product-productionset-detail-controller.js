(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.common';
    var angModule = angular.module(moduleName);


    /* jshint -W072*/ //many parameters because of dependency injection
    angModule.controller('productionplanningCommonProductProductionSetDetailController', ProductionplanningCommonProductProductionSetDetailController);

    ProductionplanningCommonProductProductionSetDetailController.$inject = ['$scope', 'platformDetailControllerService', 'productionplanningCommonProductProductionSetDataService',
        'productionplanningCommonProductUIStandardService', 'productionplanningCommonProductValidationFactory','productionplanningCommonTranslationService'];
    function ProductionplanningCommonProductProductionSetDetailController($scope, detailControllerService, dataService, uiStandardService, validationServiceFactory,translationService) {
        var validationService = validationServiceFactory.getValidationService(dataService);
        detailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, translationService);
    }
})();