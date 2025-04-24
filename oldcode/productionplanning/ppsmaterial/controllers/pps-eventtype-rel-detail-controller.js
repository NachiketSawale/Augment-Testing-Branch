(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    var angModule = angular.module(moduleName);
    /* jshint -W072*/ //many parameters because of dependency injection

    angModule.controller('productionplanningPpsmaterialPpsEventTypeRelationDetailController', productionplanningPpsmaterialPpsEventTypeRelationDetailController);

    productionplanningPpsmaterialPpsEventTypeRelationDetailController.$inject =
        ['$scope', 'platformContainerControllerService'];
    function productionplanningPpsmaterialPpsEventTypeRelationDetailController($scope, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, 'de0bbc30b6954aec9ed0abf0c66b4130', 'productionplanningPpsMaterialTranslationService');
    }

})();
