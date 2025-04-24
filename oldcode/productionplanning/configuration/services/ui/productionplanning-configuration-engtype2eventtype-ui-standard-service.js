(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationEngtype2eventtypeUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of engtype2eventtype entities
     */
    angModule.factory('productionplanningConfigurationEngtype2eventtypeUIStandardService', UIStandardService);

    UIStandardService.$inject = ['platformUIStandardConfigService',
        'platformUIStandardExtentService',
        'platformSchemaService',
        'productionplanningConfigurationTranslationService',
        'productionplanningConfigurationEngtype2eventtypeLayout',
        'productionplanningConfigurationEngtype2eventtypeLayoutConfig'];

    function UIStandardService(platformUIStandardConfigService,
                               platformUIStandardExtentService,
                               platformSchemaService,
                               translationServ,
                               layout,
                               layoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'EngType2PpsEventTypeDto',
            moduleSubModule: 'ProductionPlanning.Configuration'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function Engtype2EventTypeUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        Engtype2EventTypeUIStandardService.prototype = Object.create(BaseService.prototype);
        Engtype2EventTypeUIStandardService.prototype.constructor = Engtype2EventTypeUIStandardService;

        var service = new BaseService(layout, schemaProperties, translationServ);

        platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return layout;
        };

        return service;
    }
})(angular);