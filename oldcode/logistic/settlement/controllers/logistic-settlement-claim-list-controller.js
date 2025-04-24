/**
 * Created by chin-han.lai on 01/09/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementClaimListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement claim entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementClaimListController', LogisticSettlementClaimListController);

	LogisticSettlementClaimListController.$inject = ['$scope', 'platformContainerControllerService','logisticSettlementConstantValues','logisticSettlementClaimDataService'];

	function LogisticSettlementClaimListController($scope, platformContainerControllerService,logisticSettlementConstantValues,logisticSettlementClaimDataService) {
		platformContainerControllerService.initController($scope, moduleName, logisticSettlementConstantValues.uuid.container.settlementClaimList);

		var tools = [{
			id: 't1000',
			sort: 1000,
			caption: 'cloud.common.refresh',
			type: 'item',
			iconClass: 'tlb-icons ico-refresh',
			fn: function refresh() {
				logisticSettlementClaimDataService.refresh();
			}
		}, {
			id: 'showInactive',
			caption: 'cloud.common.showInactive',
			type: 'check',
			iconClass: 'tlb-icons ico-emp-report-show-inactive',
			fn: function () {
				logisticSettlementClaimDataService.showInactiveClaims(this.value);
			}
		}];

		$scope.addTools(tools);
	}
})(angular);