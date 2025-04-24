(function () {

    'use strict';
    var moduleName = 'productionplanning.header';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningHeader2ClerkDetailController', DetailController);

    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'productionplanningHeader2ClerkDataService',
        'productionplanningHeader2ClerkUIStandardService',
        'productionplanningHeader2ClerkValidationService'];
    function DetailController($scope, platformDetailControllerService,
                              dataServ,
                              uiStandardServ,
                              validationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validationServ, uiStandardServ, 'productionplanningHeaderTranslationService');
    }
})();