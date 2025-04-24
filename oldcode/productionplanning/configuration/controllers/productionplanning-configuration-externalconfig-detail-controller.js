(function (angular) {
    /*global angular*/
    'use strict';

    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('ppsExternalConfigurationDetailController', DetailController);
    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'ppsExternalConfigurationDataService',
        'ppsExternalConfigurationValidationService',
        'ppsExternalConfigurationUIStandardService',
        'productionplanningConfigurationTranslationService'];

    function DetailController($scope, platformDetailControllerService,
                              dataServ,
                              validServ,
                              confServ,
                              translationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
    }

})(angular);