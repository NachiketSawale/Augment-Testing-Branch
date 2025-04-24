/**
 * Created by baf on 14.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement item entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementItemDetailController', LogisticSettlementItemDetailController);

	LogisticSettlementItemDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementItemDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9b6d9118e5bc486b816323c36d7626cb');
	}

})(angular);