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
    angular.module(moduleName).factory('productionplanningPpsMaterialEventTypeUIStandardService', productionplanningPpsMaterialEventTypeUIStandardService);

    productionplanningPpsMaterialEventTypeUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService',
        'platformSchemaService', 'productionplanningPpsMaterialEventTypeLayout', 'platformUIStandardExtentService', 'productionplanningPpsMaterialEventTypeLayoutConfig'];

    function productionplanningPpsMaterialEventTypeUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
                                                                     platformSchemaService, ppsMaterialEventTypeLayout, platformUIStandardExtentService, ppsMaterialEventTypeLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'MaterialEventTypeDto',
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

        var service = new BaseService(ppsMaterialEventTypeLayout, schemaProperties, ppsMaterialTranslationService);

        platformUIStandardExtentService.extend(service, ppsMaterialEventTypeLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return ppsMaterialEventTypeLayout;
        };

        return service;
    }
})();