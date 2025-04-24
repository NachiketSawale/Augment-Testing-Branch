(function (angular) {
    'use strict';
    /* global angular, _*/
    var moduleName = 'productionplanning.common';
    /**
     * @ngdoc service
     * @name productionplanningCommonHeaderProcessor
     * @function
     * @requires
     *
     * @description
     * productionplanningCommonHeaderProcessor is the service to process data in main entity
     *
     */
    angular.module(moduleName).factory('productionplanningCommonHeaderProcessor', ProductionplanningCommonHeaderProcessor);

    ProductionplanningCommonHeaderProcessor.$inject = ['platformRuntimeDataService', 'basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue'];

    function ProductionplanningCommonHeaderProcessor(platformRuntimeDataService, basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
        var service = {};

        service.processItem = function processItem(item) {
            if (item.Version === 0) {
                service.setColumnReadOnly(item, 'PrjProjectFk', true);
                var categoryId = ppsCommonCodGeneratorConstantValue.CategoryConstant.PpsHeaderCat;
                if(categoryId > 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsHeaderNumberInfoService').hasToGenerateForRubricCategory(categoryId)) {
                    item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsHeaderNumberInfoService').provideNumberDefaultText(categoryId, item.Code);
                    service.setColumnReadOnly(item, 'Code', true);
                }
                else {
                    service.setColumnReadOnly(item, 'Code', false);
                }
            }
            service.setColumnReadOnly(item, 'IsLive', true);
        };

        service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
            var fields = [
                { field: column, readonly: flag }
            ];
            platformRuntimeDataService.readonly(item, fields);
        };


        return service;
    }

})(angular);