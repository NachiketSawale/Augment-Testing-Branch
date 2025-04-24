(function () {
	'use strict';
	/*global _*/
	var moduleName = 'productionplanning.product';
	angular.module(moduleName).factory('ppsProductStructureUIConfigService', [
		'platformUIStandardConfigService', 'productionplanningCommonTranslationService',
		'productionplanningCommonProductDetailLayout', 'platformSchemaService',
		'ppsCommonCustomColumnsServiceFactory',
		function ppsProductStructureUIConfigService(
			PlatformUIStandardConfigService, translationService,
			productDetailLayout, platformSchemaService,
			customColumnsServiceFactory) {

			function isDateTimeColumn(columnSelection) {
				// columnSelection: 0~5 maps columns PLANNEDSTART, PLANNEDFINISH, EARLIESTSTART, LATESTSTART, EARLIESTFINISH and LATESTFINISH
				return columnSelection >= 0 && columnSelection <= 5;
			}

			function isQtyColumn(columnSelection) {
				// columnSelection: 6 maps  column Quantity
				return columnSelection === 6;
			}

			var dtoSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ProductDto',
				moduleSubModule: 'ProductionPlanning.Common'
			});
			var schemaProperties = _.cloneDeep(dtoSchema.properties);
			var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
			_.merge(schemaProperties, customColumnsService.attributes);

			// set groupColumnId
			var dic = {
				0: 'PlannedStart',
				1: 'PlannedFinish',
				2: 'EarliestStart',
				3: 'LatestStart',
				4: 'EarliestFinish',
				5: 'LatestFinish'
			};
			_.each(customColumnsService.eventTypeSlots, function (item) {
				if (schemaProperties[item.FieldName] && isDateTimeColumn(item.ColumnSelection)) {
					schemaProperties[item.FieldName].grouping = 'ProductionPlanning.Product.' + dic[item.ColumnSelection];
				}
				// add domain property "quantity" for custom quantity columns, that will be use in filter container
				else if (schemaProperties[item.FieldName] && isQtyColumn(item.ColumnSelection)) {
					schemaProperties[item.FieldName].domain = 'quantity';
				}
			});

			var uiServ = new PlatformUIStandardConfigService(productDetailLayout, schemaProperties, translationService);

			// remove grouping properties of custom quantity columns
			var listConfig = uiServ.getStandardConfigForListView();
			var eventTypeQtySlots = _.filter(customColumnsService.eventTypeSlots, function (item) {
				return isQtyColumn(item.ColumnSelection);
			});
			var qtyFields = _.map(eventTypeQtySlots, function (e) {
				return e.FieldName.toLowerCase();
			});
			_.each(listConfig.columns, function (column) {
				if (_.findIndex(qtyFields, function (o) {
					return o === column.id.toLowerCase();
				}) > -1) {
					column.grouping = undefined;
				}
			});

			// disable grouping for eventTypeDateSlots_week
			listConfig.columns.forEach(function (col) {
				if(col.id.startsWith('event_type_slot_') && col.id.endsWith('_week')){
					col.grouping = undefined;
				}
			});

			return uiServ;
		}
	]);
})();