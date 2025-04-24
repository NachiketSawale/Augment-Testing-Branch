(function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name productionplanningProductionsetContainerInformationService
     * @function
     *
     * @description
     * productionplanningProductionsetContainerInformationService is the data service for all Production Set related functionality.
     * */

    var moduleName = 'productionplanning.productionset';
    var ProductionsetModul = angular.module(moduleName);

    ProductionsetModul.factory('productionplanningProductionsetContainerInformationService', ProductionplanningProductionsetContainerInformationService);
    ProductionplanningProductionsetContainerInformationService.$inject = ['$injector', 'ppsCommonLoggingHelper', 'ppsCommonClipboardService'];

    function ProductionplanningProductionsetContainerInformationService($injector, ppsCommonLoggingHelper, ppsCommonClipboardService) {

        var service = {};
        service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
            var config = {};
            var layServ = null;
            switch (guid) {
                case '2581963f63944bdca59bec07f539cafb': //productionplanningProductionsetListController
                    layServ = $injector.get('productionplanningProductionsetUIStandardService');
                    config.layout = layServ.getStandardConfigForListView();
                    config.ContainerType = 'Grid';
                    config.standardConfigurationService = 'productionplanningProductionsetUIStandardService';
                    config.dataServiceName = 'productionplanningProductionsetMainService';
                    config.validationServiceName = 'productionplanningProductionsetValidationService';
                    config.listConfig = {initCalled: false, columns: [], type: 'productionplanning.productionset', dragDropService: ppsCommonClipboardService};
                    extendValidation4Logging(config); // extend validation for logging
                    break;

                case '9e6d0550dbc845abbba4c239fc4763e5': //productionplanningProductionsetDetailsController
                    layServ = $injector.get('productionplanningProductionsetUIStandardService');
                    config = layServ.getStandardConfigForDetailView();
                    config.ContainerType = 'Detail';
                    config.standardConfigurationService = 'productionplanningProductionsetUIStandardService';
                    config.dataServiceName = 'productionplanningProductionsetMainService';
                    config.validationServiceName = 'productionplanningProductionsetValidationService';
                    extendValidation4Logging(config); // extend validation for logging
                    break;

            }
            return config;
        };

        function extendValidation4Logging(config) {
            ppsCommonLoggingHelper.extendValidationIfNeeded(
                $injector.get(config.dataServiceName),
                $injector.get(config.validationServiceName),
                {
                    typeName: 'ProductionsetDto',
                    moduleSubModule: 'ProductionPlanning.ProductionSet'
                }
            );
        }

        return service;

    }


})(angular);
