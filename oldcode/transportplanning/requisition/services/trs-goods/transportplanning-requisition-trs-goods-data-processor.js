/**
 * Created by lav on 4/13/2020.
 */

/* global angular, _ */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.requisition';
	/**
	 * @ngdoc service
	 * @name transportplanningRequisitionTrsGoodsDataProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningRequisitionTrsGoodsDataProcessor is the service to set fields  dynamically readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('transportplanningRequisitionTrsGoodsDataProcessor', DataProcessor);

	DataProcessor.$inject = [
		'platformRuntimeDataService',
		'trsGoodsTypes', 'basicsLookupdataLookupDescriptorService', 'moment'];

	function DataProcessor(platformRuntimeDataService,
						   trsGoodsTypes, basicsLookupdataLookupDescriptorService, moment) {

		var service = {};

		service.processItem = function processItem(item) {
			if (item) {
				var readonlyFields = ['ProductsDescription', 'PrjStockFk', 'PrjStockLocationFk', 'ProductTemplateCodes', 'ProductTemplateDescriptions',
					'MinProductionDate', 'MaxProductionDate', 'CurrentLocationJobFk'];
				if (item.Version > 0 || !!item.PpsUpstreamItemFk) {
					readonlyFields.push('TrsGoodsTypeFk');
					readonlyFields.push('Good');
				}
				if (item.TrsPlannedStart) {
					item.TrsPlannedStart = moment.utc(item.TrsPlannedStart);
				}
				service.setColumnsReadOnly(item, readonlyFields, true);
				service.processItemByGood(item);
				if (item.TrsReqStatusFk) {
					var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', item.TrsReqStatusFk);
					if (status && status.IsAccepted) {
						var columns = [];
						_.each(item, function (value, key) {
							columns.push(key);
						});
						service.setColumnsReadOnly(item, columns, true);
					}
				}

				setColsReadonlyIfUpstreamItemFkSet(item);
			}
		};

		service.processItemByGood = function (item) {
			var readOnly = item.TrsGoodsTypeFk === trsGoodsTypes.Bundle;
			service.setColumnsReadOnly(item, ['UomFk', 'Quantity'], readOnly);
			var readOnlyDG =  (item.TrsGoodsTypeFk === trsGoodsTypes.Bundle || item.TrsGoodsTypeFk === trsGoodsTypes.Generic);
			service.setColumnsReadOnly(item, ['BasDangerclassFk', 'DangerQuantity', 'BasUomDGFk'], readOnlyDG);
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			if (columns.length <= 0) {
				return;
			}
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		function setColsReadonlyIfUpstreamItemFkSet(item) {
			if(item.Version > 0){
				platformRuntimeDataService.readonly(item, !!item.PpsUpstreamItemFk);
			}
		}

		return service;
	}
})(angular);