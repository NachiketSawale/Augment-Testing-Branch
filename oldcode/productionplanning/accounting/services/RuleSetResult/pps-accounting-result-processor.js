/**
 * Created by anl on 4/25/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingResultProcessor', processor);

	processor.$inject = ['platformRuntimeDataService'];

	function processor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			var flag = item.ComponentTypeFk === 1;
			service.setColumnsReadOnly(item, ['MaterialFk'], !flag);
			service.setColumnsReadOnly(item, ['CostCodeFk'], flag);
			//service.setColumnsReadOnly(item, ['UomFk'], true);

			service.setColumnsReadOnly(item, ['PpsEntityFk'], !item.UpdActive);
			service.setColumnsReadOnly(item, ['Property'], !item.UpdActive);
			service.setColumnsReadOnly(item, ['OverrideUom'], !item.UpdActive);

		};
		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);
