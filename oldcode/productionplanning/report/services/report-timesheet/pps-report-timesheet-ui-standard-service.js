/**
 * Created by anl on 1/23/2017.
 */

(function(){
    'use strict';

    var moduleName= 'productionplanning.report';

    angular.module(moduleName).factory('productionplanningReportTimeSheetUIStandardService', TimeSheetUIStandardService);

    TimeSheetUIStandardService.$inject = ['platformUIStandardConfigService',
        'productionplanningReportTranslationService',
        'platformSchemaService',
        'platformUIStandardExtentService',
        'productionplanningReportTimeSheetLayout'];

    function TimeSheetUIStandardService(platformUIStandardConfigService,
        ppsReportTranslationService,
        platformSchemaService,
        platformUIStandardExtentService,
        timeSheetLayout){

        var BaseService = platformUIStandardConfigService;

        var timeSheetAttributeDomains = platformSchemaService.getSchemaFromCache({
            typeName: 'TimeSheetDto',
            moduleSubModule: 'ProductionPlanning.Report'
        });
        timeSheetAttributeDomains = timeSheetAttributeDomains.properties;

        return new BaseService(timeSheetLayout, timeSheetAttributeDomains, ppsReportTranslationService);

        //platformUIStandardExtentService.extend(service, timeSheetLayoutConfig.addition, timeSheetAttributeDomains);
    }

})();