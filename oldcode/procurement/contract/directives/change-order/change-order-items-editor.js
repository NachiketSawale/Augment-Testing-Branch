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
	angular.module('procurement.contract').directive('prcOrderChangeItemsLookup', ['basicsCommonDialogGridControllerService', 'procurementChangeOrderItemsUIStandardService', 'procurementChangeOrderItemDataService', 'procurementCommonPrcItemValidationService',
		function (basicsCommonDialogGridControllerService, procurementChangeOrderItemsUIStandardService, procurementChangeOrderItemDataService, procurementCommonPrcItemValidationService) {
			return {
				restrict: 'A',
				scope: {
					entity: '='
				},
				templateUrl: globals.appBaseUrl + 'procurement.contract/partials/change-order/change-order-items-grid.html',
				controller: ['$scope', controller]
			};

			function controller(scope) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					grouping: false,
					uuid: 'C07724B7E0D44D4D9CA20728671F095D'
				};

				var itemDataService = scope.entity.itemDataService;
				var Validation = {};
				Validation = procurementCommonPrcItemValidationService(itemDataService);
				basicsCommonDialogGridControllerService.initListController(scope, procurementChangeOrderItemsUIStandardService, itemDataService, Validation, gridConfig);
			}
		}
	]);

})(angular);
