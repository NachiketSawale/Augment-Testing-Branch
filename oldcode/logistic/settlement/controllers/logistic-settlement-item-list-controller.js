/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement item entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementItemListController', LogisticSettlementItemListController);

	LogisticSettlementItemListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementItemListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '83b83e9c1f704f74bf28f721435b7f93');
	}
})(angular);