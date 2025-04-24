/**
 * Created by anl on 9/20/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionplanningMountingResRequisitionProcessor', ResRequisitionProcessor);

    ResRequisitionProcessor.$inject = ['platformRuntimeDataService', 'resourceTypeLookupDataService'];

    function ResRequisitionProcessor(platformRuntimeDataService, resourceTypeLookupDataService) {
        var service = {};

        service.processItem = function (item){
            service.setColumnReadOnly(item, 'PpsEventFk', true);
            service.setColumnReadOnly(item, 'ProjectFk', true);
			service.processItemByResType(item);
        };

		service.processItemByResType = function (item) {
			var resType = resourceTypeLookupDataService.getItemByKey(item.TypeFk);

			if (resType) {
				item.DispatcherGroupFk = resType.DispatcherGroupFk;
			}
			var fields = [
				{
					field: 'Islinkedfixtoreservation',
					readonly: item.Version !== 0
				},
				{
					field: 'DispatcherGroupFk',
					readonly: true
				}
			];
			platformRuntimeDataService.readonly(item, fields);
		};
		// remark: process item by resType, according to the similar code about processItem in resourceRequisitionDataService(by zwz on 2019/6/5)

        service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
            var fields = [
                {field: column, readonly: flag}
            ];
            platformRuntimeDataService.readonly(item, fields);
        };


        return service;
    }

})(angular);