/**
 * Created by anl on 1/22/2018.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.report';

    angular.module(moduleName).factory('productionplanningReportContainerInformationService', PpsReportContainerInformationService);

    PpsReportContainerInformationService.$inject = ['$injector', 'ppsCommonClipboardService'];

    function PpsReportContainerInformationService($injector, ppsCommonClipboardService) {

        var service = {},
	        dynamicConfigurations;

        service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
            var config = {};
            var layServ = null;
            var clipboardService = null;
            switch (guid) {

                case 'a17a58e59a944f95ae9e0c7f627c9e1a': //ReportListController
                    layServ = $injector.get('productionplanningReportReportUIStandardService');
                    config.layout = layServ.getStandardConfigForListView();
                    config.ContainerType = 'Grid';
                    config.standardConfigurationService = 'productionplanningReportReportUIStandardService';
                    config.dataServiceName = 'productionplanningReportReportDataService';
                    config.validationServiceName = 'productionpalnningReportReportValidationService';
                    config.listConfig = {
                        initCalled: false,
                        columns: [],
	                     type: 'productionplanning.report',
	                     dragDropService: ppsCommonClipboardService,
                        pinningContext: true //set to refresh tools when pinningContext changed
                    };
                    break;
                case 'f32ffb6f21d34c7ab7aca13882ec61fe': //ReportDetailController
                    layServ = $injector.get('productionplanningReportReportUIStandardService');
                    config = layServ.getStandardConfigForDetailView();
                    config.ContainerType = 'Detail';
                    config.standardConfigurationService = 'productionplanningReportReportUIStandardService';
                    config.dataServiceName = 'productionplanningReportReportDataService';
                    config.validationServiceName = 'productionpalnningReportReportValidationService';
                    break;
                case 'af02d448a61b4e048dc76d7cedf76bfa': //Report2ProductListController
                    clipboardService = $injector.get('productionplanningReportProductClipboardService');
                    layServ = $injector.get('productionplanningCommonProductUIStandardService');
                    config.layout = layServ.getStandardConfigForListView();
                    config.ContainerType = 'Grid';
                    config.standardConfigurationService = 'productionplanningCommonProductUIStandardService';
                    config.listConfig = {
                        initCalled: false,
                        columns: [],
                        dragDropService: clipboardService
                    };
                    break;
                case 'f690bd4b069d48cc995447dc5776899d': //TimeSheetListController
                    layServ = $injector.get('productionplanningReportTimeSheetUIStandardService');
                    config.layout = layServ.getStandardConfigForListView();
                    config.ContainerType = 'Grid';
                    config.standardConfigurationService = 'productionplanningReportTimeSheetUIStandardService';
                    config.listConfig = {initCalled: false, columns: []};
                    break;
                case 'dc2aa594192c407e966c368a3c7791cc': //TimeSheetDetailController
                    layServ = $injector.get('productionplanningReportTimeSheetUIStandardService');
                    config = layServ.getStandardConfigForDetailView();
                    config.ContainerType = 'Detail';
                    config.standardConfigurationService = 'productionplanningReportTimeSheetUIStandardService';
                    break;
                case '187a17f9e2ca468a9d2cab369d28e4bf': //Report2CostCodeListController
                    layServ = $injector.get('productionplanningReport2CostCodeUIStandardService');
                    config.layout = layServ.getStandardConfigForListView();
                    config.ContainerType = 'Grid';
                    config.standardConfigurationService = 'productionplanningReport2CostCodeUIStandardService';
                    config.listConfig = {initCalled: false, columns: []};
                    break;
                case '504a75f8108c459eb85c9e3217cd5159': //Report2CostCodeDetailController
                    layServ = $injector.get('productionplanningReport2CostCodeUIStandardService');
                    config = layServ.getStandardConfigForDetailView();
                    config.ContainerType = 'Detail';
                    config.standardConfigurationService = 'productionplanningReport2CostCodeUIStandardService';
                    break;
                case 'cd94de40c47c4ac9adf6285250e9764f': //ReportProductFilterController
                    clipboardService = $injector.get('productionplanningReportProductFilterClipboardService');
                    layServ = $injector.get('productionplanningCommonProductUIStandardService');
                    config.layout = layServ.getStandardConfigForListView();
                    config.ContainerType = 'Grid';
                    config.standardConfigurationService = 'productionplanningCommonProductUIStandardService';
                    config.dataServiceName = 'productionplanningReportProductFilterDataService';
                    config.listConfig = {
                        initCalled: false,
                        columns: [],
                        dragDropService: clipboardService,
                        type: 'ReportrProductFilter'
                    };
                    break;
                default:
                    config = service.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
                    break;
            }

            return config;
        };


        //For dynamic configuration
        dynamicConfigurations = {};

        service.hasDynamic = function hasDynamic(guid) {
            return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
        };

        service.takeDynamic = function takeDynamic(guid, config) {
            dynamicConfigurations[guid] = config;
        };

        return service;
    }
})(angular);