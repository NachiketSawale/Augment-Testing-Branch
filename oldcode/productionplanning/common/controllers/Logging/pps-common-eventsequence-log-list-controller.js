/**
 * Created by zov on 1/17/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    /**
     * @ngdoc controller
     * @name ppsCommonEventSequenceLogListController
     * @requires
     * @description
     * #
     * Controller for ppsCommonEventSequenceLogList
     */
    var moduleName = 'productionplanning.common';
    angular.module(moduleName).controller('ppsCommonEventSequenceLogListController', ctrl);
    ctrl.$inject = ['$scope', 'platformGridControllerService',
        '$injector', 'ppsCommonEventSequenceLogServiceFactory',
        'ppsCommonLogUIStandardService'];
    function ctrl($scope, platformGridControllerService,
                  $injector, ppsCommonEventSequenceLogServiceFactory,
                  ppsCommonLogUIStandardService) {
        var ctrlOptions = $scope.getContentValue('controllerOptions');
        var parentServiceName = ctrlOptions.parentService;
        var translationServiceName = ctrlOptions.translationService;
        var dataSrv = ppsCommonEventSequenceLogServiceFactory.getService(parentServiceName, translationServiceName);
        platformGridControllerService.initListController($scope, ppsCommonLogUIStandardService, dataSrv, {}, { idProperty: 'PpsItemAndLogId'});
    }
})();