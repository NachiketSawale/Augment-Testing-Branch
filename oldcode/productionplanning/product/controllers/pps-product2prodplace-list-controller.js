/**
 * Created by zov on 4/24/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.product';
    angular.module(moduleName).controller('ppsProduct2ProdPlaceListController', [
        '$scope',
        'platformGridControllerService',
        'ppsProduct2ProdPlaceUIService',
        'ppsProduct2ProdPlaceDataService',
        'ppsProduct2ProdPlaceValidationService',
        function ($scope,
                  platformGridControllerService,
                  ppsProduct2ProdPlaceUIService,
                  ppsProduct2ProdPlaceDataService,
                  ppsProduct2ProdPlaceValidationService) {
            var gridConfig = {
                initCalled: false,
                columns: []
            };
            platformGridControllerService.initListController($scope, ppsProduct2ProdPlaceUIService, ppsProduct2ProdPlaceDataService, ppsProduct2ProdPlaceValidationService, gridConfig);
        }
    ]);
})();