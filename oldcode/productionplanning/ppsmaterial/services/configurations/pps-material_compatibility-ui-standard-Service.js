(function () {
    'use strict';
    /* global angular */
    var moduleName = 'productionplanning.ppsmaterial';
    /**
     * @ngdoc service
     * @name pppsMaterialCompatibilityUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of Pps Material Compatibility entities
     */
    angular.module(moduleName).factory('pppsMaterialCompatibilityUIStandardService', pppsMaterialCompatibilityUIStandardService);

    pppsMaterialCompatibilityUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService',
        'platformSchemaService', 'ppsMaterialCompatibilityLayout', 'platformUIStandardExtentService', 'ppsMaterialCompatibilityLayoutConfig'];

    function pppsMaterialCompatibilityUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
                                                                     platformSchemaService, ppsMaterialCompatibilityLayout, platformUIStandardExtentService, ppsMaterialCompatibilityLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'PpsMaterialCompDto',
            moduleSubModule: 'ProductionPlanning.PpsMaterial'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function EventTypeUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        EventTypeUIStandardService.prototype = Object.create(BaseService.prototype);
        EventTypeUIStandardService.prototype.constructor = EventTypeUIStandardService;

        var service = new BaseService(ppsMaterialCompatibilityLayout, schemaProperties, ppsMaterialTranslationService);

        platformUIStandardExtentService.extend(service, ppsMaterialCompatibilityLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return ppsMaterialCompatibilityLayout;
        };

        return service;
    }
})();