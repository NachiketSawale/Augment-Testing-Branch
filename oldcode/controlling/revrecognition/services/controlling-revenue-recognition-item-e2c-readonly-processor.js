/**
 * Created by alm on 11/17/2021.
 */

(function (angular) {
	'use strict';
	angular.module('controlling.revrecognition').factory('controllingRevenueRecognitionItemE2cReadonlyProcessor',
		['_', 'platformRuntimeDataService', 'platformSchemaService', 'basicsCommonReadOnlyProcessor', 'controllingRevenueRecognitionHeaderDataService',
			function (_, platformRuntimeDataService, platformSchemaService, commonReadOnlyProcessor, parentService) {

				var service = {};

				service.processItem = function processItem(item) {
					var parentReadOnly = !parentService.getHeaderEditAble();
					if (parentReadOnly || item.HasChildren) {
						// service.setRowReadOnly(item,parentReadOnly);
						platformRuntimeDataService.readonly(item, true);
					} else {
						var fields = ['Code', 'Description', 'EstimatedCost', 'ActualCost', 'ActualCostPercent', 'ContractedValue', 'CalculatedRevenue', 'CalculatedRevenuePercent', 'ActualRevenue', 'RevenueAccrual', 'RevenueAccrualPercent', 'RevenueToComplete'];
						var readonlyFields = [];
						_.forEach(fields, function (field) {
							readonlyFields.push({field: field, readonly: true});
						});
						platformRuntimeDataService.readonly(item, readonlyFields);
						// if (item.HasChildren) {
						// service.setRowReadOnly(item,parentReadOnly);
						// }
						// service.setFieldsReadOnly(item);
					}
				};

				return service;
			}]);

})(angular);
