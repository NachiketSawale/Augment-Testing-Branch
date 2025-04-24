/**
 * Created by zov on 4/3/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).controller('ppsCommonFormController', [
        '$scope',
        '$injector',
        function ($scope,
                  $injector) {
            var params = $scope.modalOptions.params;
            var ctrlSrv = params.controllerService;
            if (angular.isString(ctrlSrv)) {
                ctrlSrv = $injector.get(ctrlSrv);
            }
            ctrlSrv.initController($scope, params.controllerInitParam);
        }
    ]);

})();