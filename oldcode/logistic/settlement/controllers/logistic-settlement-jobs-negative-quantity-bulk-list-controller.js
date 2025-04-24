/**
 * Created by chin-han.lai on 08/09/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementJobsNegativeQuantityBulkListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement BulkNegativeLocationsVEntity entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementJobsNegativeQuantityBulkListController', LogisticSettlementJobsNegativeQuantityBulkListController);

	LogisticSettlementJobsNegativeQuantityBulkListController.$inject = ['$scope', 'platformContainerControllerService','logisticSettlementConstantValues', 'logisticSettlementJobsNegativeQuantityBulkDataService'];

	function LogisticSettlementJobsNegativeQuantityBulkListController($scope, platformContainerControllerService, logisticSettlementConstantValues, logisticSettlementJobsNegativeQuantityBulkDataService) {
		platformContainerControllerService.initController($scope, moduleName, logisticSettlementConstantValues.uuid.container.jobsWithNegativeQuantityForBulkList);

		var tools = [{
			id: 't1000',
			sort: 1000,
			caption: 'cloud.common.refresh',
			type: 'item',
			iconClass: 'tlb-icons ico-refresh',
			fn: function refresh() {
				logisticSettlementJobsNegativeQuantityBulkDataService.refresh();
			}
		}, {
			id: 'd999',
			sort: 999,
			type: 'divider'
		}];

		$scope.addTools(tools);
	}
})(angular);