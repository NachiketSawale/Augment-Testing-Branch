(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    var angModule = angular.module(moduleName);


    /* jshint -W072*/ //many parameters because of dependency injection
    angModule.controller('productionplanningPpsmaterialEventTypeListController', productionplanningPpsmaterialEventTypeListController);

    productionplanningPpsmaterialEventTypeListController.$inject = ['$scope', 'platformContainerControllerService',
        'platformTranslateService', 'productionplanningPpsMaterialEventTypeUIStandardService'];
    function productionplanningPpsmaterialEventTypeListController($scope, platformContainerControllerService,
                                                                  platformTranslateService, uiStandardService) {
        platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
        platformContainerControllerService.initController($scope, moduleName, '43d8655f5b7b4357a3b3a7839ce7243b');
    }
})();