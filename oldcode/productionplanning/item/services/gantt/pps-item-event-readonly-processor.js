/**
 * Created by anl on 5/24/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemEventReadonlyProcessor', PpsItemEventReadonlyProcessor);

	PpsItemEventReadonlyProcessor.$inject = ['platformRuntimeDataService'];

	function PpsItemEventReadonlyProcessor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item){
			service.setRowReadOnly(item, item.IsReadonly || !item.HasWriteRight);
			if (item.IsLocked === true) {
				service.setColumnReadOnly(item, 'PlannedStart', true);
				service.setColumnReadOnly(item, 'PlannedFinish', true);
			}

		};

		service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		service.setRowReadOnly = function setRowReadOnly(item, flag){
			platformRuntimeDataService.readonly(item, flag);
		};

		return service;
	}

})(angular);
