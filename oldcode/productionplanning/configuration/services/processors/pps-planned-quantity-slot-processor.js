(function (angular) {
	'use strict';
	/* global angular, _ */
	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).factory('productionplanningPlannedQuantitySlotProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', 'ppsConfigurationPlannedQuantityTypes',
		'typeExtensionsService'];

	function processor(platformRuntimeDataService, plannedQuantityTypes,
		typeExtensionsService) {
		let service = {};

		service.processItem = function (item) {
			item.Result = item.PpsPlannedQuantityTypeFk < 6 && item.PpsPlannedQuantityTypeFk > 0 && item.Result !== '' && item.Result !== null ?
				typeExtensionsService.stringToUserLocaleNumber(item.Result) : item.Result;

			service.setColumnsReadOnly(item, ['MdcProductDescriptionFk'], item.PpsPlannedQuantityTypeFk !== plannedQuantityTypes.Material);
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			let fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);