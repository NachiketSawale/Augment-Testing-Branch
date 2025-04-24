(function (angular) {
    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.controller('ppsExternalConfigClobController', ppsExternalConfigClobController);

    ppsExternalConfigClobController.$inject = ['$scope', 'productionplanningConfigurationClobControllerService','ppsExternalConfigurationDataService'];

    function ppsExternalConfigClobController($scope, clobControllerService, ppsExternalConfigurationDataService) {

        var layInfo = {
            mainService: ppsExternalConfigurationDataService,
            parentService: ppsExternalConfigurationDataService,
            enableCache: true,
            foreignKey: 'BasClobsFk'
        };

        clobControllerService.initController($scope, layInfo);
    }
})(angular);
		