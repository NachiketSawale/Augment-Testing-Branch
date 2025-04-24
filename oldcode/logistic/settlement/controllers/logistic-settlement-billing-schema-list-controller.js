/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBillingSchemaListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement item entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementBillingSchemaListController', LogisticSettlementBillingSchemaListController);

	LogisticSettlementBillingSchemaListController.$inject = ['$scope', '_', 'platformContainerControllerService', 'logisticSettlementDataService', 'logisticSettlementBillingSchemaDataService'];

	function LogisticSettlementBillingSchemaListController($scope, _, platformContainerControllerService, logisticSettlementDataService, logisticSettlementBillingSchemaDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'ba266dee53274c009f78307f98dbfcbc');
		var tools = [{
			id: 't1000',
			sort: 1000,
			caption: 'logistic.settlement.recalculate',
			type: 'item',
			iconClass: 'control-icons ico-recalculate',
			disabled: function () {
				return _.isEmpty(logisticSettlementDataService.getSelected());
			},
			fn: function updateCalculation() {
				logisticSettlementDataService.update().then(function(){
					logisticSettlementBillingSchemaDataService.recalculateBillingSchema();
				});
			}
		}, {
			id: 'd999',
			sort: 999,
			type: 'divider'
		}];

		$scope.addTools(tools);

		var updateTools = function () {
			if ($scope.tools) {
				$scope.tools.update();
			}
		};

		logisticSettlementDataService.registerSelectionChanged(updateTools);
		$scope.$on('$destroy', function () {
			logisticSettlementDataService.unregisterSelectionChanged(updateTools);
		});
	}
})(angular);