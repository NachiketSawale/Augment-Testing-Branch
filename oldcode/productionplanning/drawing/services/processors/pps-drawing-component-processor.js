/**
 * Created by lav on 4/29/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingComponentProcessor', processor);

	processor.$inject = ['platformRuntimeDataService','drawingComponentTypes'];

	function processor(platformRuntimeDataService,drawingComponentTypes) {
		var service = {};

		service.processItem = function (item) {
			if (item && item.Isimported) {
				service.setColumnsReadOnly(item, ['EngDrwCompTypeFk', 'MdcMaterialFk', 'MdcCostCodeFk','BasUomFk','Quantity'], true);
			} else {
				service.setColumnsReadOnly(item, ['MdcMaterialFk'], item.EngDrwCompTypeFk !== drawingComponentTypes.Material);
				service.setColumnsReadOnly(item, ['MdcCostCodeFk'], item.EngDrwCompTypeFk !== drawingComponentTypes.CostCode);
			}
			service.setColumnsReadOnly(item, ['EngAccRulesetResultFk'], true);

			if (item.IsReadonly) {
				platformRuntimeDataService.readonly(item, true);
			}

			if(item.Version > 0){
				service.setColumnsReadOnly(item, ['EngDrwCompTypeFk'], true);
			}

			item.entityType = 'engDrawingComponent'; // set entity type to identify component
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
