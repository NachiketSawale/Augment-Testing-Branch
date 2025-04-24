(function (angular) {
    'use strict';

    /**
     * @name productionplanningProductionsetDetailsController
     * @function
     *
     * */

    var moduleName = 'productionplanning.productionset';
    var ProductionsetModul = angular.module(moduleName);

    ProductionsetModul.controller('productionplanningProductionsetDetailsController', ProductionsetDetailsController);
    ProductionsetDetailsController.$inject = ['$scope', 'platformContainerControllerService'];

    function ProductionsetDetailsController($scope, platformContainerControllerService) {

        platformContainerControllerService.initController($scope, moduleName, '9e6d0550dbc845abbba4c239fc4763e5', 'productionplanningProductionsetTranslationService');
    }
})(angular);