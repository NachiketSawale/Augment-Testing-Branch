/**
 * Created by chd on 3/1/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/**
	 * @ngdoc directive
	 * @name purchaseOrderChangeItemsLookupDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for puchase order change
	 */
	angular.module('procurement.contract').directive('prcOrderChangeDeliverySchedulesLookup', ['basicsCommonDialogGridControllerService', 'procurementChangeOrderItemDeliveryUIStandardService', 'procurementChangeOrderContextService', 'procurementChangeOrderItemDeliveryScheduleDataService', 'procurementCommonDeliveryScheduleValidationService',
		function (basicsCommonDialogGridControllerService, procurementChangeOrderItemDeliveryUIStandardService, moduleContext, dataServiceFactory, procurementCommonDeliveryScheduleValidationService) {
			return {
				restrict: 'A',
				scope: {
					entity: '='
				},
				templateUrl: globals.appBaseUrl + 'procurement.contract/partials/change-order/change-order-item-delivery-schedules-grid.html',
				controller: ['$scope', controller]
			};

			function controller(scope) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					grouping: false,
					uuid: '16B6102BE3464014A122D30BE3D1C13E'
				};

				var deliveryScheduleDataService = dataServiceFactory.getService(moduleContext.getItemDataService());
				var Validation = {};
				Validation = procurementCommonDeliveryScheduleValidationService(deliveryScheduleDataService);
				basicsCommonDialogGridControllerService.initListController(scope, procurementChangeOrderItemDeliveryUIStandardService, deliveryScheduleDataService, Validation, gridConfig);
			}
		}
	]);

})(angular);
