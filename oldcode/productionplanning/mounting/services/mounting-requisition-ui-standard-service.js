/**
 * Created by anl on 10/18/2017.
 */

(function () {
    'use strict';
    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionplanningMoungtingRequisitionUIStandardService', RequisitionUIStandardService);

    RequisitionUIStandardService.$inject = ['ppsCommonLoggingUiService', 'productionplanningMountingTranslationService',
        'platformSchemaService', 'platformUIStandardExtentService', 'mountingRequisitionLayout', 'mountingRequisitionConfig'];

    function RequisitionUIStandardService(ppsCommonLoggingUiService, ppsMountingTranslationService,
                                          platformSchemaService, platformUIStandardExtentService, requisitionLayout, requisitionLayouConfig) {

        var BaseService = ppsCommonLoggingUiService;

        var schemaOption = {
            typeName: 'RequisitionDto',
            moduleSubModule: 'ProductionPlanning.Mounting'
        };

        var service = new BaseService(requisitionLayout, schemaOption, ppsMountingTranslationService);

        platformUIStandardExtentService.extend(service, requisitionLayouConfig.addition);

        return service;
    }
})();