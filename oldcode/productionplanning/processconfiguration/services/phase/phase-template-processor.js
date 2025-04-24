(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseTemplateProcessor', processor);

	processor.$inject = ['platformRuntimeDataService',
		'$injector'];

	function processor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item) {
			service.setColumnsReadOnly(item, ['ExecutionLimit'], !item.IsPlaceholder);
			service.setColumnsReadOnly(item, ['ProcessTemplateDefFk'], !item.IsPlaceholder);
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