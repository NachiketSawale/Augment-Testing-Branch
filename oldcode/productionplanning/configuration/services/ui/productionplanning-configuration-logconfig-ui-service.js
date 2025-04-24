/**
 * Created by zov on 11/18/2019.
 */
(function () {
    'use strict';
    /*global angular*/
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    angModule.factory('ppsConfigurationLogConfigUIStandardService', UIStandardService);

    UIStandardService.$inject = ['platformUIStandardConfigService',
        'platformSchemaService',
        'productionplanningConfigurationTranslationService',
        'ppsConfigurationLogConfigLayout'];

    function UIStandardService(platformUIStandardConfigService,
                               platformSchemaService,
                               translationServ,
                               layout) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'PpsLogConfigDto',
            moduleSubModule: 'ProductionPlanning.Configuration'
        });
        var schemaProperties = dtoSchema.properties;

        var service = new BaseService(layout, schemaProperties, translationServ);
        service.setFieldChangeHandler = function (fieldChangeHandler) {
            _.forEach(service.getStandardConfigForDetailView().rows, function (row) {
                row.change = function (entity, field) {
                        fieldChangeHandler(entity, field);
                };
            });
        };

        return service;
    }
})();