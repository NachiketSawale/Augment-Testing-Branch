/**
 * Created by lid on 8/14/2017.
 */
(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionplanningMountingRequisitionProcessor', ProductionplanningMountingRequisitionProcessor);

    ProductionplanningMountingRequisitionProcessor.$inject = ['platformRuntimeDataService','basicsCompanyNumberGenerationInfoService', 'ppsMountingConstantValues'];

    function ProductionplanningMountingRequisitionProcessor(platformRuntimeDataService, basicsCompanyNumberGenerationInfoService, ppsMountingConstantValues) {
        var service = {};

        service.processItem = function processItem(item) {
            if (item.Version === 0) {
                service.setColumnReadOnly(item, 'ProjectFk', true);
	            if(basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsMountingNumberInfoService').hasToGenerateForRubricCategory(ppsMountingConstantValues.requsitionRubricCat) )
	            {
		            item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsMountingNumberInfoService').provideNumberDefaultText(ppsMountingConstantValues.requsitionRubricCat, item.Code);
		            service.setColumnReadOnly(item, 'Code', true);
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
