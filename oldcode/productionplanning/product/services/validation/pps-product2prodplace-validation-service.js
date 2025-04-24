/**
 * Created by zov on 4/24/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.product';
    angular.module(moduleName).service('ppsProduct2ProdPlaceValidationService', [
        'platformValidationServiceFactory', 'ppsProduct2ProdPlaceDataService',
        function (platformValidationServiceFactory, dataService) {

            platformValidationServiceFactory.addValidationServiceInterface({
                    typeName: 'PpsProductToProdPlaceDto',
                    moduleSubModule: 'ProductionPlanning.Product'
                }, {
                    mandatory: ['PpsProductFk', 'PpsProductionPlaceFk', 'Timestamp']
                },
                this,
                dataService);

        }
    ]);
})();