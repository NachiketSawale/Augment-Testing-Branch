/**
 * Created by zov on 4/26/2020.
 */
(function () {
    'use strict';
    /*global angular*/
    var moduleName = 'productionplanning.product';
    angular.module(moduleName).service('ppsProduct2ProdPlaceProcessor', ['$rootScope',
        function ppsProductTransactionReadonlyProcessor($rootScope) {
            this.processItem = function processItem(item) {
                var prodPlaceFk = item.PpsProductionPlaceFk;
                Object.defineProperty(item, 'PpsProductionPlaceFk', {
                    get: function () {
                        return prodPlaceFk;
                    },
                    set: function (value) {
                        prodPlaceFk = value;
                        $rootScope.$broadcast('PpsProductPlaceChanged');
                    }
                });
            };
        }]);
})();