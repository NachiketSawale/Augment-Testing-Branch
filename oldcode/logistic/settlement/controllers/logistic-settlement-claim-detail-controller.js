/**
 * Created by chin-han.lai on 01/09/2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementClaimDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement claim entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementClaimDetailController', LogisticSettlementClaimDetailController);

	LogisticSettlementClaimDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticSettlementConstantValues'];

	function LogisticSettlementClaimDetailController($scope, platformContainerControllerService,logisticSettlementConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, logisticSettlementConstantValues.uuid.container.settlementClaimDetail);
	}

})(angular);