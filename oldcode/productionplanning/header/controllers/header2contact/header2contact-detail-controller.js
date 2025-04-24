(function () {

    'use strict';
    var moduleName = 'productionplanning.header';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningHeader2ContactDetailController', DetailController);

    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'productionplanningHeader2ContactDataService',
        'productionplanningHeader2ContactUIStandardService',
        'productionplanningHeader2ContactValidationService'];
    function DetailController($scope, platformDetailControllerService,
                              dataServ,
                              uiStandardServ,
                              validationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validationServ, uiStandardServ, 'productionplanningHeaderTranslationService');
    }
})();