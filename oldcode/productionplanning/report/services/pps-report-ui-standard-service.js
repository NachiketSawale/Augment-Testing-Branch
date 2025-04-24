/**
 * Created by anl on 1/22/2018.
 */

(function () {
    'use strict';
    var moduleName = 'productionplanning.report';

    angular.module(moduleName).factory('productionplanningReportReportUIStandardService', ReportUIStandardService);

    ReportUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningReportTranslationService',
        'platformSchemaService', 'platformUIStandardExtentService', 'productionplanningReportLayout',
        'productionplanningReportLayoutConfig'];

    function ReportUIStandardService(platformUIStandardConfigService, ppsReportTranslationService,
                                     platformSchemaService, platformUIStandardExtentService, reportLayout, reportLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var reportAttributeDomains = platformSchemaService.getSchemaFromCache({
            typeName: 'ReportDto',
            moduleSubModule: 'ProductionPlanning.Report'
        });
        reportAttributeDomains = reportAttributeDomains.properties;

        var service = new BaseService(reportLayout, reportAttributeDomains, ppsReportTranslationService);

        platformUIStandardExtentService.extend(service, reportLayoutConfig.addition, reportAttributeDomains);

        return service;
    }
})();