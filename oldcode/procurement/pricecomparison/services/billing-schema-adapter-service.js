/**
 * Created by wed on 2021/8/26.
 */
(function (angular) {
	'use strict';

	angular.module('procurement.pricecomparison').factory('priceComparisonBillingSchemaAdapterService', [
		'priceComparisonBillingSchemaService',
		'procurementPriceComparisonCommonService',
		function (
			billingSchemaService,
			commonService) {

			let onRefreshCompareField = function (args) {
				if (args.eventName === 'GeneralRedrawTree') {
					billingSchemaService.recalculateBillingSchema();
				}
			};

			return {
				disabled: function (parentService) {
					return !parentService.allSelectedQuote;
				},
				onControllerCreate: function () {
					commonService.onRefreshCompareField.register(onRefreshCompareField);
				},
				onControllerDestroy: function () {
					commonService.onRefreshCompareField.unregister(onRefreshCompareField);
				}
			};

		}]);

})(angular);
