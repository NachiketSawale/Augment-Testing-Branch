/**
 * Created by lav on 12/13/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItem2MdcMaterialReadonlyProcessor', ReadonlyProcessor);

	ReadonlyProcessor.$inject = ['platformRuntimeDataService'];

	function ReadonlyProcessor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			if (item && item.Version > 0) {
				service.setColumnReadOnly(item, 'MdcMaterialFk', true);
			}
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
