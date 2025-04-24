/**
 * Created by zwz on 12/16/2020.
 */
(function () {

    'use strict';
    var moduleName = 'productionplanning.product';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningProductEngProdComponentDetailController', DetailController);

    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'productionplanningProductEngProdComponentDataService',
        'productionplanningProductEngProdComponentUIStandardService',
        'productionplanningProductEngProdComponentValidationService'];
    function DetailController($scope, platformDetailControllerService,
        dataServ,
        uiStandardServ,
        validationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validationServ, uiStandardServ, 'productionplanningProductTranslationService');
    }
})();