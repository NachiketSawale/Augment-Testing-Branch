/**
 * Created by lav on 4/29/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', 'ppsCommonCustomColumnsServiceFactory', 'productionplanningDrawingStatusLookupService'];

	function processor(platformRuntimeDataService, customColumnsServiceFactory, productionplanningDrawingStatusLookupService) {
		var service = {};

		var customColumnsService = customColumnsServiceFactory.getService(moduleName);
		var clerkRoleFields = _.map(customColumnsService.clerkRoleSlots, 'FieldName');

		service.processItem = function (item) {
			let statusList = productionplanningDrawingStatusLookupService.getList();
			let status = _.find(statusList, {Id: item.EngDrawingStatusFk});
			if(status.BackgroundColor) {
				item.BackgroundColor = status.BackgroundColor;
			}

			if (item && item.Version > 0) {
				service.setColumnsReadOnly(item, ['PrjProjectFk', 'LgmJobFk', 'PpsItemFk'], true);
			}

			if (_.isArray(item.ReadonlyCustomColumns)) {
				service.setColumnsReadOnly(item, item.ReadonlyCustomColumns, true);
			}

			if (_.isNil(item.PpsItemFk)) {
				service.setColumnsReadOnly(item, clerkRoleFields, true);
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
