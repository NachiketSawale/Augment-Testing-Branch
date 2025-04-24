/**
 * Created by zov on 4/24/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.product';
    angular.module(moduleName).factory('ppsProduct2ProdPlaceLayout', [
        'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
        function (platformLayoutHelperService, basicsLookupdataConfigGenerator) {

            function getOverloads(overloads) {
                var ovls = {};
                if (overloads) {
                    _.forEach(overloads, function (ovl) {
                        var ol = getOverload(ovl);
                        if (ol) {
                            ovls[ovl] = ol;
                        }
                    });
                }

                return ovls;
            }

            function getOverload(overload) {
                var ovl = null;
                switch (overload) {
                    case 'ppsproductionplacefk':
                        ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                            dataServiceName: 'ppsProductionPlaceLookupDataService',
                            cacheEnable: true,
                            additionalColumns: false
                        });
                        break;
                }

                return ovl;
            }

            var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.product2prodplace.detailform',
                ['ppsproductionplacefk', 'timestamp', 'slabnumber', 'positionx', 'positiony', 'positionz']);

            layout.overloads = getOverloads(['ppsproductionplacefk']);
            layout.addAdditionalColumns = true;
            return layout;
        }
    ]);

    angular.module(moduleName).factory('ppsProduct2ProdPlaceLayoutConfig', [
        'platformObjectHelper',
        function (platformObjectHelper) {
            return {
                addition: {
                    grid: platformObjectHelper.extendGrouping([])
                }
            };
        }
    ]);
})();