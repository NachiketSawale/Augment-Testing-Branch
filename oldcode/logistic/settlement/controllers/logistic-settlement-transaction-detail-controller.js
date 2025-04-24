/**
 * Created by baf on 14.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementTransactionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement item entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementTransactionDetailController', LogisticSettlementTransactionDetailController);

	LogisticSettlementTransactionDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementTransactionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '58d2195480fc44de9744010f06c9a978');
	}

})(angular);