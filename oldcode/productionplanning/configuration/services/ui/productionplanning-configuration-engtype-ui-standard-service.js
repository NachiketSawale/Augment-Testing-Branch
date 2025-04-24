(function () {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationEngtypeUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of engtype entities
     */
    angModule.factory('productionplanningConfigurationEngtypeUIStandardService', UIStandardService);

    UIStandardService.$inject = ['platformUIStandardConfigService',
        'platformUIStandardExtentService',
        'platformSchemaService',
        'productionplanningConfigurationTranslationService',
        'productionplanningConfigurationEngtypeLayout',
        'productionplanningConfigurationEngtypeLayoutConfig'];

    function UIStandardService(platformUIStandardConfigService,
                               platformUIStandardExtentService,
                               platformSchemaService,
                               translationServ,
                               layout,
                               layoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'EngTypeDto',
            moduleSubModule: 'ProductionPlanning.Configuration'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function EngTypeUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        EngTypeUIStandardService.prototype = Object.create(BaseService.prototype);
        EngTypeUIStandardService.prototype.constructor = EngTypeUIStandardService;

        var service = new BaseService(layout, schemaProperties, translationServ);

        platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return layout;
        };

        return service;
    }
})(angular);