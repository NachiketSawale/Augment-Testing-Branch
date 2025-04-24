/**
 * Created by anl on 5/24/2017.
 */

(function (angular) {
	'use strict';
	/* global _ */

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemProcessor', ProductionPlanningItemProcessor);

	ProductionPlanningItemProcessor.$inject = ['$injector', 'platformRuntimeDataService', 'ppsCommonCustomColumnsServiceFactory',
		'productionplanningItemStatusLookupService', 'productionplanningDrawingStatusLookupService'];

	function ProductionPlanningItemProcessor($injector, platformRuntimeDataService, customColumnsServiceFactory,
		productionplanningItemStatusLookupService, productionplanningDrawingStatusLookupService) {
		var service = {};

		service.processItem = function (item) {
			var status = productionplanningItemStatusLookupService.getItemList();
			if (status && item.PPSItemStatusFk) {
				var existStatus = _.find(status, {Id: item.PPSItemStatusFk});
				if (existStatus) {
					item.Backgroundcolor = existStatus.BackgroundColor;
				}
			}
			let drwStatusList = productionplanningDrawingStatusLookupService.getList();
			if(item.EngDrawingStatusFk) {
				let drwStatus = _.find(drwStatusList, {Id: item.EngDrawingStatusFk});
				if(drwStatus && drwStatus.BackgroundColor){
					item.DrawingStatusBackgroundColor = drwStatus.BackgroundColor;
				}
			}

			let readonlyFields = [
				{field: 'PPSItemStatusFk', readonly: true},
				{field: 'IsLive', readonly: true},
				{field: 'ProductionOrder', readonly: item.InProduction}
			];

			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			customColumnsService.updateDateTimeFields(item);

			setUpstreamState(item);

			if (_.isArray(item.ReadonlyCustomColumns)) {
				_.each(item.ReadonlyCustomColumns, function (column) {
					readonlyFields.push({field: column, readonly: true});
				});
			}

			// set getType() function
			// because the slot field should get type from slot
			item.getType = function (fieldName) {
				return getEntityTypeForLogging(item, fieldName);
			};

			if (item.IsReadOnly) {
				platformRuntimeDataService.readonly(item, true);
			}

			//set materialFk readonly
			if(item.ProductDescriptionFk && item.MdcMaterialFk){
				readonlyFields.push({field: 'MdcMaterialFk', readonly: true});
			}
			// remark: according to ticket #139348, material can't be changed if product template is set to PU. in any other case, material of PU should be editable.

			let lockProductTemplate = (item.HasChildren || item.ProductDescriptionFk || !item.MdcMaterialFk || !item.MaterialGroupFk);
			readonlyFields.push({field: 'ProductDescriptionFk', readonly: lockProductTemplate});

			readonlyFields.push({field: 'ProductDescriptionCode', readonly: _.isNil(item.ProductDescriptionFk)});

			platformRuntimeDataService.readonly(item, readonlyFields);

			if(item.IsForPreliminary === true){
				platformRuntimeDataService.readonly(item, true);
			}
		};

		function getEntityTypeForLogging(item, fieldName) {
			if(fieldName){
				var customColumnsService = customColumnsServiceFactory.getService(moduleName);
				var eventTypeSlot = _.find(customColumnsService.eventTypeSlots, {FieldName: fieldName});
				if(eventTypeSlot){
					return eventTypeSlot.PpsEventTypeFk;
				}
			}

			return item.ItemTypeFk;
		}

		function setUpstreamState(item) {
			if (item.IsUpstreamDefined === 'None') {
				let ppsItemDataService = $injector.get('productionplanningItemDataService');
				let parentItem = ppsItemDataService.getItemById(item.PPSItemFk);
				while (parentItem) {
					if (parentItem.IsUpstreamDefined === 'Linked') {
						item.IsUpstreamDefined = 'Inherited';
						break;
					}
					parentItem = ppsItemDataService.getItemById(parentItem.PPSItemFk);
				}
			}
		}

		service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}

})(angular);
