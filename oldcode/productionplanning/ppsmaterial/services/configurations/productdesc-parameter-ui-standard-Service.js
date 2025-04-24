(function () {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    /**
     * @ngdoc service
     * @name ppsMaterialProductDescParameterUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of master entities
     */
    angular.module(moduleName).factory('productionplanningPpsMaterialProductDescParameterUIStandardService',productionplanningPpsMaterialProductDescParameterUIStandardService );

    productionplanningPpsMaterialProductDescParameterUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService',
        'platformSchemaService', 'productionplanningPpsMaterialProductDescParameterLayout', 'platformUIStandardExtentService', 'productionplanningPpsMaterialProductDescParameterLayoutConfig'];

    function productionplanningPpsMaterialProductDescParameterUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
                                                     platformSchemaService, ppsMaterialProductDescParameterLayout, platformUIStandardExtentService, ppsMaterialProductDescParameterLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'MdcProductDescParamDto', moduleSubModule: 'ProductionPlanning.PpsMaterial' });
        var schemaProperties;
        if(dtoSchema)
        {
            schemaProperties = dtoSchema.properties;
        }
        function ProductDescParameterUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        ProductDescParameterUIStandardService.prototype = Object.create(BaseService.prototype);
        ProductDescParameterUIStandardService.prototype.constructor = ProductDescParameterUIStandardService;

        var service =  new BaseService(ppsMaterialProductDescParameterLayout, schemaProperties, ppsMaterialTranslationService);

        platformUIStandardExtentService.extend(service, ppsMaterialProductDescParameterLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return ppsMaterialProductDescParameterLayout;
        };

        return service;
    }
})();