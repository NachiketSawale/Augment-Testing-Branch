(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaParameterProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', 'ppsFormulaConfigurationDomainTypes',
		'typeExtensionsService'];

	function processor(platformRuntimeDataService, ppsFormulaConfigurationDomainTypes,
		typeExtensionsService) {
		var service = {};

		service.processItem = function (item) {
			switch (item.BasDisplayDomainFk) {
				case ppsFormulaConfigurationDomainTypes.Boolean:
					item.Value = item.Value && item.Value.toLocaleLowerCase() !== 'false';
					break;
				case ppsFormulaConfigurationDomainTypes.Quantity:
					item.Value = typeExtensionsService.stringToUserLocaleNumber(item.Value);
					break;
			}
			service.setColumnsReadOnly(item, ['VariableName', 'BasDisplayDomainFk', 'DescriptionInfo'], true);
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