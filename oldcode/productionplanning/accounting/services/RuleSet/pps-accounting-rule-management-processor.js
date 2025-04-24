/**
 * Created by lav on 7/23/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingRuleManagementProcessor', processor);

	processor.$inject = ['platformRuntimeDataService'];

	function processor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			if (item && item.Version > 0) {
				service.setColumnsReadOnly(item, ['RuleSetFk', 'ImportFormatFk'], true);
			}
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
