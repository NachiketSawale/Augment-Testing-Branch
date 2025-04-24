/**
 * Created by wwa on 8/21/2015.
 */
(function (angular) {
	/* global moment */
	'use strict';
	/**
     * @ngdoc service
     * @name ServiceDataProcessDatesExtension
     * @function
     *
     * @description
     * The ServiceDataProcessDatesExtension converts date strings into real date variables.
     */

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module('platform').factory('complexServiceDataProcessDatesExtension', ['basicsLookupdataLookupDescriptorService',
		function (basicsLookupdataLookupDescriptorService) {

			var service = {},dyFields = [];

			var dateFields = ['Requisition2PackageData.MinDateRequired', 'Requisition2PackageData.MinDateReceived',
				'Rfq2PackageData.MinDateRequested', 'Rfq2PackageData.MinDateQuoteDeadline', 'Rfq2PackageData.MinDateAwardDeadline',
				'Pes2PackageData.MinDateDelivered', 'Pes2PackageData.MaxDateDelivered',
				'Contract2PackageData.MinDateOrdered', 'Contract2PackageData.MinDateDelivery'];

			service.getDynamicFieldsFromEvent = function () {
				var mainEvents = _.filter(basicsLookupdataLookupDescriptorService.getData('PrcEventType'), function (item) {
					return item.IsMainEvent;
				});
				if(dyFields.length !== mainEvents.length * 2){
					dyFields = [];
					_.forEach(mainEvents, function (item) {
						dyFields = dyFields.concat(['MainEvent' + item.Id + '.StartRelevant', 'MainEvent' + item.Id + '.EndRelevant']);
					});
				}
				return dyFields;
			};

			service.processItem = function processItem(item) {
				var dynamicFields = dateFields.concat(service.getDynamicFieldsFromEvent());
				if (dynamicFields.length > 0) {
					for (var n = 0; n < dynamicFields.length; ++n) {
						var field = dynamicFields[n];
						if (item && _.get(item, field)) {
							var processedVal = moment.utc(_.get(item, field));
							_.set(item, field, processedVal);
						}
					}
				}
			};

			service.revertProcessItem = function revertProcessItem(item) {
				var dynamicFields = dateFields.concat(service.getDynamicFieldsFromEvent());
				if (dynamicFields.length > 0) {
					for (var n = 0; n < dynamicFields.length; ++n) {
						var field = dynamicFields[n];
						if (item && _.get(item, field)) {
							var processedVal = _.get(item, field);
							if(processedVal && processedVal.format){
								_.set(item, field, processedVal.format());
							}
						}
					}
				}
			};

			return service;
		}]);
})(angular);