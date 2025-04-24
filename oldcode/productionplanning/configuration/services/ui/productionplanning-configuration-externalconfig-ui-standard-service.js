(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name ppsExternalConfigurationUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of engtype entities
     */
    angModule.factory('ppsExternalConfigurationUIStandardService', UIStandardService);

    UIStandardService.$inject = ['platformUIStandardConfigService',
        'platformUIStandardExtentService',
        'platformSchemaService',
        'productionplanningConfigurationTranslationService',
        'ppsExternalConfigurationLayout',
        'ppsExternalConfigurationLayoutConfig'];

    function UIStandardService(platformUIStandardConfigService,
                               platformUIStandardExtentService,
                               platformSchemaService,
                               translationServ,
                               layout,
                               layoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'PpsExternalconfigDto',
            moduleSubModule: 'ProductionPlanning.Configuration'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function ExternalConfigUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        ExternalConfigUIStandardService.prototype = Object.create(BaseService.prototype);
        ExternalConfigUIStandardService.prototype.constructor = ExternalConfigUIStandardService;

        var service = new BaseService(layout, schemaProperties, translationServ);

        platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return layout;
        };

        return service;
    }
})(angular);