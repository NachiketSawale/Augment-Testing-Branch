(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    var angModule = angular.module(moduleName);
    /* jshint -W072*/ //many parameters because of dependency injection

    angModule.controller('productionplanningPpsmaterialEventTypeDetailController', productionplanningPpsmaterialEventTypeDetailController);

    productionplanningPpsmaterialEventTypeDetailController.$inject =
        ['$scope', 'platformContainerControllerService'];
    function productionplanningPpsmaterialEventTypeDetailController($scope, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, '0de5eadccc3f47d98ff39b2af6d6dd2c', 'productionplanningPpsMaterialTranslationService');
    }

})();
