(function () {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    /**
     * @ngdoc service
     * @name ppsMaterialProductDescUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of Pps Material Event Type Relation entities
     */
    angular.module(moduleName).factory('productionplanningPpsMaterialPpsEventTypeRelationUIStandardService', productionplanningPpsMaterialPpsEventTypeRelationUIStandardService);

    productionplanningPpsMaterialPpsEventTypeRelationUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService',
        'platformSchemaService', 'productionplanningPpsEventTypeRelationLayout', 'platformUIStandardExtentService', 'productionplanningPpsEventTypeRelationLayoutConfig'];

    function productionplanningPpsMaterialPpsEventTypeRelationUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
                                                                     platformSchemaService, ppsEventTypeRelationLayout, platformUIStandardExtentService, ppsEventTypeRelationLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'PpsEventTypeRelDto',
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

        var service = new BaseService(ppsEventTypeRelationLayout, schemaProperties, ppsMaterialTranslationService);

        platformUIStandardExtentService.extend(service, ppsEventTypeRelationLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return ppsEventTypeRelationLayout;
        };

        return service;
    }
})();