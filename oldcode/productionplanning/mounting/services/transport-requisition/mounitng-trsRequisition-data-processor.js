/**
 * Created by anl on 9/20/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionplanningMountingTrsRequisitionProcessor', TrsRequisitionProcessor);

    TrsRequisitionProcessor.$inject = ['platformRuntimeDataService', 'mountingTrsRequisitionStatusLookupService'];

    function TrsRequisitionProcessor(platformRuntimeDataService, mntTrsReqStatusService) {
        var service = {};

        service.processItem = function (item){

			var reqStatusList = mntTrsReqStatusService.getList();
			var status = _.find(reqStatusList, {Id: item.TrsReqStatusFk});
			if (status && status.IsAccepted) {
				_.each(item, function (value, key) {
					service.setColumnReadOnly(item, key, true);
				});
			}

            service.setColumnReadOnly(item, 'TrsReqStatusFk', true);
            service.setColumnReadOnly(item, 'ProjectFk', true);
        };

        service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
            var fields = [
                {field: column, readonly: flag}
            ];
            platformRuntimeDataService.readonly(item, fields);
        };


        return service;
    }

})(angular);