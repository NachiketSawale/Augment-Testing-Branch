(function (angular) {
	'use strict';
	/* global angular, _ */
	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsPlannedQuantityProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', 'ppsPlannedQuantityQuantityTypes',
		'typeExtensionsService'];

	function processor(platformRuntimeDataService, ppsPlannedQuantityQuantityTypes,
		typeExtensionsService) {
		var service = {};

		service.processItem = function (item) {
			item.PropertyMaterialCostcodeFk = item.PpsPlannedQuantityTypeFk < 6 && item.PpsPlannedQuantityTypeFk > 0 && item.PropertyMaterialCostcodeFk !== '' && item.PropertyMaterialCostcodeFk !== null ?
				typeExtensionsService.stringToUserLocaleNumber(item.PropertyMaterialCostcodeFk) : item.PropertyMaterialCostcodeFk;

			service.setColumnsReadOnly(item, ['BasUomFk', 'PropertyMaterialCostcodeFk'], false);
			if (item.PpsPlannedQuantityTypeFk === ppsPlannedQuantityQuantityTypes.Userdefined) {
				service.setColumnsReadOnly(item, ['PropertyMaterialCostcodeFk'], true);
			}

			service.setColumnsReadOnly(item, ['MdcProductDescriptionFk'], item.PpsPlannedQuantityTypeFk !== ppsPlannedQuantityQuantityTypes.Material);
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