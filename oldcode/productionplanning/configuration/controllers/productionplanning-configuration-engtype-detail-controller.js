(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationEngtypeDetailController', DetailController);
    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'productionplanningConfigurationEngtypeDataService',
        'productionplanningConfigurationEngtypeValidationService',
        'productionplanningConfigurationEngtypeUIStandardService',
        'productionplanningConfigurationTranslationService'];

    function DetailController($scope, platformDetailControllerService,
                              dataServ,
                              validServ,
                              confServ,
                              translationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
    }

})(angular);