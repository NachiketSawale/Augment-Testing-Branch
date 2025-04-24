(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.transport';
    var angModule = angular.module(moduleName);

    angModule.controller('transportplanningTransportWaypointDetailController', transportplanningTransportWaypointDetailController);
    transportplanningTransportWaypointDetailController.$inject = ['$scope', 'platformDetailControllerService',
        'transportplanningTransportWaypointDataService',
        'transportplanningTransportWaypointValidationService',
        'transportplanningTransportWaypointUIStandardService',
        'transportplanningTransportTranslationService'];

    function transportplanningTransportWaypointDetailController($scope, platformDetailControllerService,
                                                                dataServ,
                                                                validServ,
                                                                confServ,
                                                                translationServ) {

        platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
    }

})(angular);