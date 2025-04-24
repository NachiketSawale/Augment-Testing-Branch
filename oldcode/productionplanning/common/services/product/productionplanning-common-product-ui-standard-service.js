(function () {
    'use strict';
    var moduleName = 'productionplanning.common';
    /**
     * @ngdoc service
     * @name productionplanningCommonProductUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of master entities
     */
    angular.module(moduleName).factory('productionplanningCommonProductUIStandardService', ProductionplanningCommonProductUIStandardService);

    ProductionplanningCommonProductUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningCommonTranslationService',
        'platformSchemaService', 'productionplanningCommonProductDetailLayout', 'platformUIStandardExtentService',
        'productionplanningCommonProductMainLayout', 'ppsCommonCustomColumnsServiceFactory', 'ppsCommonLayoutOverloadService'];

    function ProductionplanningCommonProductUIStandardService(platformUIStandardConfigService, productionplanningCommonTranslationService,
                                                              platformSchemaService, productionplanningCommonProductDetailLayout, platformUIStandardExtentService,
                                                              productionplanningCommonProductMainLayout, customColumnsServiceFactory, ppsCommonLayoutOverloadService) {

        var BaseService = platformUIStandardConfigService;

        var masterAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common' });
        masterAttributeDomains = masterAttributeDomains.properties;
        var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
        _.merge(masterAttributeDomains, customColumnsService.attributes);

        function MasterUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        MasterUIStandardService.prototype = Object.create(BaseService.prototype);
        MasterUIStandardService.prototype.constructor = MasterUIStandardService;

        var service = new BaseService(productionplanningCommonProductDetailLayout, masterAttributeDomains, productionplanningCommonTranslationService);

        platformUIStandardExtentService.extend(service, productionplanningCommonProductMainLayout.addition, masterAttributeDomains);

        service.getProjectMainLayout = function () {
            return productionplanningCommonProductDetailLayout;
        };

	     ppsCommonLayoutOverloadService.translateCustomUom(service);

	    return service;
    }
})();
