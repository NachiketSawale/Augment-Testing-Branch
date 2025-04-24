(function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name ProductionsetUIStandardService
     * @function
     *
     * @description
     * ProductionsetUIStandardService is the data service for all Production Set related functionality.
     * */

    var moduleName = 'productionplanning.productionset';
    var ProductionsetModul = angular.module(moduleName);

    ProductionsetModul.factory('productionplanningProductionsetUIStandardService', ProductionsetUIStandardService);
    ProductionsetUIStandardService.$inject = ['ppsCommonCustomColumnsServiceFactory',
        'ppsCommonLoggingUiService',
        'platformSchemaService',
        'platformUIStandardExtentService',
        'productionplanningProductionsetTranslationService',
        'productionplanningProductionsetDetailLayout',
        'productionplanningProductionsetMainLayoutConfig'];

    function ProductionsetUIStandardService(customColumnsServiceFactory,
                                            ppsCommonLoggingUiService,
                                            platformSchemaService,
                                            platformUIStandardExtentService,
                                            productionplanningProductionsetTranslationService,
                                            productionplanningProductionsetDetailLayout,
                                            productionplanningProductionsetMainLayoutConfig) {

        var BaseService = ppsCommonLoggingUiService;

        var schemaOption = { typeName: 'ProductionsetDto', moduleSubModule: 'ProductionPlanning.ProductionSet' };

        var dtoSchema = platformSchemaService.getSchemaFromCache(schemaOption);
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
            var customColumnsService = customColumnsServiceFactory.getService(moduleName);
            _.merge(schemaProperties, customColumnsService.attributes);
        }

        var service = new BaseService(productionplanningProductionsetDetailLayout, schemaOption, productionplanningProductionsetTranslationService);

        platformUIStandardExtentService.extend(service, productionplanningProductionsetMainLayoutConfig.addition);

        service.getProjectMainLayout = function () {
            return productionplanningProductionsetDetailLayout;

        };

        return service;
    }
})(angular);
