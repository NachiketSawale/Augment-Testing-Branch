/**
 * Created by franck.li on 27.04.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name purchaseOrderChangeItemsLookupDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for puchase order change :Decrease Quantity
	 */
	angular.module('basics.common').directive('purchaseOrderChangeItemsLookup', ['basicsCommonDialogGridControllerService', 'basicsCommonPoChangeItemsUIStandardService', 'procurementCommonPrcItemValidationService', 'globals',
		function (basicsCommonDialogGridControllerService, basicsCommonPoChangeItemsUIStandardService, procurementCommonPrcItemValidationService, globals) {
			return {
				restrict: 'A',
				scope: {
					entity: '='
				},
				templateUrl: globals.appBaseUrl + 'basics.common/partials/pochange/po-change-items-grid.html',
				controller: ['$scope', controller]
			};

			function controller(scope) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					grouping: false,
					uuid: '6909AB3938E545FB96D0005CB94DC691'
				};

				var itemDataService = scope.entity.itemDataService();
				var Validation = {};
				Validation = procurementCommonPrcItemValidationService(itemDataService);
				basicsCommonDialogGridControllerService.initListController(scope, basicsCommonPoChangeItemsUIStandardService, itemDataService, Validation, gridConfig);
			}
		}
	]);

})(angular);
