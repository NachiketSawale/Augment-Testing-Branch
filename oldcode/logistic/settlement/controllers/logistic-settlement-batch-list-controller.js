/**
 * Created by baf on 27.06.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBatchListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement batch entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementBatchListController', LogisticSettlementBatchListController);

	LogisticSettlementBatchListController.$inject = ['_', '$scope', 'platformContainerControllerService', 'logisticSettlementBatchDataService'];

	function LogisticSettlementBatchListController(_, $scope, platformContainerControllerService, logisticSettlementBatchDataService) {
		platformContainerControllerService.initController($scope, moduleName, '54eb41757bff45f7b6c1941aceb2bdd8');

		var tools = [{
			id: 't1000',
			sort: 1000,
			caption: 'logistic.settlement.loadBatches',
			type: 'item',
			iconClass: 'tlb-icons ico-refresh',
			fn: function loadBatches() {
				logisticSettlementBatchDataService.loadBatches();
			}
		}, {
			id: 'd999',
			sort: 999,
			type: 'divider'
		}];

		$scope.addTools(tools);
	}
})(angular);