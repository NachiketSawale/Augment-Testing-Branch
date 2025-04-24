/**
 * Created by zov on 12/18/2019.
 */
(function () {
    'use strict';
    /*global angular*/
    var moduleName = 'productionplanning.item';
    angular.module(moduleName).controller('ppsItemLogListController', ctrl);
    ctrl.$inject = ['$scope', 'platformGridControllerService',
        'ppsCommonLogUIStandardService', 'ppsItemLogDataService'];
    function ctrl($scope, platformGridControllerService,
                  ppsCommonLogUIStandardService, ppsItemLogDataService) {
        platformGridControllerService.initListController($scope, ppsCommonLogUIStandardService, ppsItemLogDataService, {}, {});
    }
})();