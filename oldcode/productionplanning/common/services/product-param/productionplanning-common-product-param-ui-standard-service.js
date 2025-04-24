/**
 * Created by lid on 7/12/2017.
 */

(function () {
    'use strict';
    var moduleName = 'productionplanning.common';
    /**
     * @ngdoc service
     * @name productionplanningCommonProductParamUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of item entities
     */
    angular.module(moduleName).factory('productionplanningCommonProductParamUIStandardService', ProductionplanningCommonProductParamUIStandardService);

    ProductionplanningCommonProductParamUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningCommonTranslationService',
        'platformSchemaService', 'productionplanningComonProductParamLayout', 'platformUIStandardExtentService',
        'productionplanningComonProductParamLayoutConfig'];

    function ProductionplanningCommonProductParamUIStandardService(platformUIStandardConfigService, productionplanningCommonTranslationService,
                                                  platformSchemaService, productionplanningComonProductParamLayout, platformUIStandardExtentService, productionplanningComonProductParamLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var productdescParamAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ProductParamDto', moduleSubModule: 'ProductionPlanning.Common' });
        productdescParamAttributeDomains = productdescParamAttributeDomains.properties;

        function ProductdescParamUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        ProductdescParamUIStandardService.prototype = Object.create(BaseService.prototype);
        ProductdescParamUIStandardService.prototype.constructor = ProductdescParamUIStandardService;

        var service =  new BaseService(productionplanningComonProductParamLayout, productdescParamAttributeDomains, productionplanningCommonTranslationService);

        platformUIStandardExtentService.extend(service, productionplanningComonProductParamLayoutConfig.addition, productdescParamAttributeDomains);

        service.getProjectMainLayout = function () {
            return productionplanningComonProductParamLayout;
        };

        return service;
    }
})();
