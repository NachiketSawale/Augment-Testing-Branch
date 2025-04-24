(function () {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationEventtype2restypeUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of eventtype2restype entities
     */
    angModule.factory('productionplanningConfigurationEventtype2restypeUIStandardService', UIStandardService);

    UIStandardService.$inject = ['platformUIStandardConfigService',
        'platformUIStandardExtentService',
        'platformSchemaService',
        'productionplanningConfigurationTranslationService',
        'productionplanningConfigurationEventtype2restypeLayout',
        'productionplanningConfigurationEventtype2restypeLayoutConfig'];

    function UIStandardService(platformUIStandardConfigService,
                               platformUIStandardExtentService,
                               platformSchemaService,
                               translationServ,
                               layout,
                               layoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'EventType2ResTypeDto',
            moduleSubModule: 'ProductionPlanning.Configuration'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function EventType2ResTypeUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        EventType2ResTypeUIStandardService.prototype = Object.create(BaseService.prototype);
        EventType2ResTypeUIStandardService.prototype.constructor = EventType2ResTypeUIStandardService;

        var service = new BaseService(layout, schemaProperties, translationServ);

        platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return layout;
        };

        return service;
    }
})(angular);