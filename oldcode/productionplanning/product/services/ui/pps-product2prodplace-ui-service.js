/**
 * Created by zov on 4/24/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.product';
    angular.module(moduleName).service('ppsProduct2ProdPlaceUIService', [
        'platformUIConfigInitService',
        'ppsProduct2ProdPlaceLayout',
        'ppsProduct2ProdPlaceLayoutConfig',
        'platformUIStandardExtentService',
        'productionplanningProductTranslationService',
        function (platformUIConfigInitService,
                  ppsProduct2ProdPlaceLayout,
                  ppsProduct2ProdPlaceLayoutConfig,
                  platformUIStandardExtentService,
                  productTranslationService) {
            platformUIConfigInitService.createUIConfigurationService({
                service: this,
                layout: ppsProduct2ProdPlaceLayout,
                dtoSchemeId: {
                    moduleSubModule: 'ProductionPlanning.Product',
                    typeName: 'PpsProductToProdPlaceDto'
                },
                translator: productTranslationService
            });
            platformUIStandardExtentService.extend(this, ppsProduct2ProdPlaceLayoutConfig.addition);
        }
    ]);
})();