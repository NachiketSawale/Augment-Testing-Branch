(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationEventtype2restypeDetailController', DetailController);
    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'productionplanningConfigurationEventtype2restypeDataService',
        'productionplanningConfigurationEventtype2restypeValidationService',
        'productionplanningConfigurationEventtype2restypeUIStandardService',
        'productionplanningConfigurationTranslationService'];

    function DetailController($scope, platformDetailControllerService,
                              dataServ,
                              validServ,
                              confServ,
                              translationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
    }

})(angular);