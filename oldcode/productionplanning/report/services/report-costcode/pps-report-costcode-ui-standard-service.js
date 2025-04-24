/**
 * Created by anl on 1/23/2017.
 */

(function () {
    'use strict';
    var moduleName = 'productionplanning.report';

    angular.module(moduleName).factory('productionplanningReport2CostCodeUIStandardService', Report2CostCodeUIStandardService);

    Report2CostCodeUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningReportTranslationService',
        'platformSchemaService', 'platformUIStandardExtentService', 'productionplanningReoprt2CostCodeLayout',
        'productionplanningReoprt2CostCodeLayoutConfig'];

    function Report2CostCodeUIStandardService(platformUIStandardConfigService, ppsReportTranslationService,
                                              platformSchemaService, platformUIStandardExtentService, report2CostCodeLayout,
                                              report2CostCodeLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var r2ccAttributeDomains = platformSchemaService.getSchemaFromCache({
            typeName: 'Report2CostCodeDto',
            moduleSubModule: 'ProductionPlanning.Report'
        });
        r2ccAttributeDomains = r2ccAttributeDomains.properties;

        var service = new BaseService(report2CostCodeLayout, r2ccAttributeDomains, ppsReportTranslationService);
        platformUIStandardExtentService.extend(service, report2CostCodeLayoutConfig.addition, r2ccAttributeDomains);

        return service;
    }
})();
