(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('productionplanningConfigurationUpstreamItemTemplateDetailController', DetailController);
    DetailController.$inject = ['$scope', 'platformDetailControllerService',
        'ppsConfigurationUpstreamItemTemplateDataService',
        'ppsUpstreamTemplateValidationService',
        'ppsUpstreamItemTemplateUIStandardService',
        'productionplanningConfigurationTranslationService'];

    function DetailController($scope, platformDetailControllerService,
                              dataServ,
                              validServ,
                              confServ,
                              translationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validServ.getService(dataServ), confServ.getService(dataServ), translationServ);
    }

})(angular);