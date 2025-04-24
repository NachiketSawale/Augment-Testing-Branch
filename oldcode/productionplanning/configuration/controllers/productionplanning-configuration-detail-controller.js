(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationDetailController', DetailController);
    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'productionplanningConfigurationMainService',
        'productionplanningConfigurationValidationService',
        'productionplanningConfigurationUIStandardService',
        'productionplanningConfigurationTranslationService'];

    function DetailController($scope, platformDetailControllerService,
                              dataServ,
                              validServ,
                              confServ,
                              translationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
    }

})(angular);