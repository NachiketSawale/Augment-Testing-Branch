/**
 * Created by anl on 5/3/2017.
 */

(function () {
    'use strict';
    var moduleName = 'productionplanning.item';
    /**
     * @ngdoc service
     * @name ppsItemUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of Item entities
     */
    angular.module(moduleName).factory('productionplanningItemUIStandardService', PPSItemUIStandardService);

    PPSItemUIStandardService.$inject = ['ppsCommonLoggingUiService', 'productionplanningItemTranslationService',
        'platformSchemaService', 'productionplanningItemLayout', 'platformUIStandardExtentService',
        'productionplanningItemLayoutConfig', 'ppsCommonCustomColumnsServiceFactory'];

    function PPSItemUIStandardService(ppsCommonLoggingUiService, ppsItemTranslationService,
                                      platformSchemaService, ppsItemLayout, platformUIStandardExtentService,
                                      ppsItemLayoutConfig, customColumnsServiceFactory) {

        var BaseService = ppsCommonLoggingUiService;

        var schemaOption = { typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item' };
        var itemAttributeDomains = platformSchemaService.getSchemaFromCache(schemaOption);
        itemAttributeDomains = itemAttributeDomains.properties;
        var customColumnsService = customColumnsServiceFactory.getService(moduleName);
        _.merge(itemAttributeDomains, customColumnsService.attributes);

        var service =  new BaseService(ppsItemLayout, schemaOption, ppsItemTranslationService);

        platformUIStandardExtentService.extend(service, ppsItemLayoutConfig.addition);

        service.handleFieldChange = undefined;
        _.forEach(service.getStandardConfigForDetailView().rows, function (row) {
            row.change = function (entity, field) {
                if(service.handleFieldChange){
                    service.handleFieldChange(entity, field);
                }
            };
        });

        // hackcode: set `slot` columns's name$tr$ to be null, for fixing translation issue of slot field(as condition field) on Bulk Editor dialog of HPQC ticket #113992 (by zwz 2020/09/24)
        var slotPropertyNames = Object.getOwnPropertyNames(customColumnsService.attributes);
        _.forEach(service.getStandardConfigForListView().columns, function (col) {
            if(slotPropertyNames.indexOf(col.id) !== -1){
                col.name$tr$ = null;
            }
        });

        return service;
    }
})();
