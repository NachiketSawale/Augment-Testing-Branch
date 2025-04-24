(function () {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    /**
     * @ngdoc service
     * @name ppsMaterialProductDescUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of master entities
     */
    angular.module(moduleName).factory('productionplanningPpsMaterialProductDescUIStandardService',productionplanningPpsMaterialProductDescUIStandardService );

    productionplanningPpsMaterialProductDescUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService',
        'platformSchemaService', 'productionplanningPpsMaterialProductDescLayout', 'platformUIStandardExtentService', 'productionplanningPpsMaterialProductDescLayoutConfig'];

    function productionplanningPpsMaterialProductDescUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
                                                     platformSchemaService, ppsMaterialProductDescLayout, platformUIStandardExtentService, ppsMaterialProductDescLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'MdcProductDescriptionDto', moduleSubModule: 'ProductionPlanning.PpsMaterial' });
        var schemaProperties;
        if(dtoSchema)
        {
            schemaProperties = dtoSchema.properties;
        }
        function ProductDescUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        ProductDescUIStandardService.prototype = Object.create(BaseService.prototype);
        ProductDescUIStandardService.prototype.constructor = ProductDescUIStandardService;

        var service =  new BaseService(ppsMaterialProductDescLayout, schemaProperties, ppsMaterialTranslationService);

        platformUIStandardExtentService.extend(service, ppsMaterialProductDescLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return ppsMaterialProductDescLayout;
        };

        return service;
    }
})();