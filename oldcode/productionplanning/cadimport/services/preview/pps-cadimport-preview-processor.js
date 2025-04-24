/**
 * Created by lav on 4/29/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.cadimport';

	angular.module(moduleName).factory('ppsCadImportPreviewProcessor', processor);

	processor.$inject = ['platformRuntimeDataService'];

	function processor(platformRuntimeDataService) {
		var service = {};

		service.processItem = function (item, data) {
			if (item) {
				service.setColumnsReadOnly(item, Object.getOwnPropertyNames(item), true);

				var parentSelected = data.parentService.getSelected();
				service.setColumnsReadOnly(item, ['IsChecked'], parentSelected && parentSelected.isImporting);
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
