/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementTransactionListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement item entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementTransactionListController', LogisticSettlementTransactionListController);

	LogisticSettlementTransactionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementTransactionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5c40f34757a140a4956fd60da1072129');
	}
})(angular);