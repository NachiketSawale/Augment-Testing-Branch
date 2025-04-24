/**
 * Created by shen on 9/4/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticPostedDispHeaderUnsettledListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic posted dispatch header unsettled entities.
	 **/

	angular.module(moduleName).controller('logisticPostedDispHeaderUnsettledListController', LogisticPostedDispHeaderUnsettledListController);

	LogisticPostedDispHeaderUnsettledListController.$inject = ['$scope', 'platformContainerControllerService', 'logisticPostedDispHeaderUnsettledDataService'];

	function LogisticPostedDispHeaderUnsettledListController($scope, platformContainerControllerService, logisticPostedDispHeaderUnsettledDataService) {
		platformContainerControllerService.initController($scope, moduleName, '1d2c5ecb849942d38f9e8d298706340d');
		let tools = [{
			id: 't1000',
			sort: 1000,
			caption: 'logistic.settlement.loadPostedDNUnsettled',
			type: 'item',
			iconClass: 'tlb-icons ico-refresh',
			fn: function loadPostedDNUnsettled() {
				logisticPostedDispHeaderUnsettledDataService.loadPostedDispHeaderUnsettled();
			}
		}, {
			id: 'd999',
			sort: 999,
			type: 'divider'
		}];

		$scope.addTools(tools);
	}
})(angular);