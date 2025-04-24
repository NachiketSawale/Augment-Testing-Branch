(function () {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of eventtype2restype entities
     */
    angModule.factory('productionplanningConfigurationUIStandardService', UIStandardService);

    UIStandardService.$inject = ['platformUIStandardConfigService',
        'platformUIStandardExtentService',
        'platformSchemaService',
        'productionplanningConfigurationTranslationService',
        'productionplanningConfigurationLayout',
        'productionplanningConfigurationLayoutConfig'];

    function UIStandardService(platformUIStandardConfigService,
                               platformUIStandardExtentService,
                               platformSchemaService,
                               translationServ,
                               layout,
                               layoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'EventTypeDto',
            moduleSubModule: 'ProductionPlanning.Configuration'
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

        var service = new BaseService(layout, schemaProperties, translationServ);

        platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return layout;
        };

        return service;
    }
})(angular);