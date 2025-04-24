(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    var angModule = angular.module(moduleName);


    /* jshint -W072*/ //many parameters because of dependency injection
    angModule.controller('productionplanningPpsmaterialPpsEventTypeRelationListController', productionplanningPpsmaterialPpsEventTypeRelationListController);

    productionplanningPpsmaterialPpsEventTypeRelationListController.$inject = ['$scope', 'platformContainerControllerService',
        'platformTranslateService', 'productionplanningPpsMaterialPpsEventTypeRelationUIStandardService'];
    function productionplanningPpsmaterialPpsEventTypeRelationListController($scope, platformContainerControllerService,
                                                                  platformTranslateService, uiStandardService) {
        platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

        platformContainerControllerService.initController($scope, moduleName, '5ea20e4b3d0f40399bbf006633500b26');
    }
})();