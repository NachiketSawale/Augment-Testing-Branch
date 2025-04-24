/**
 * Created by baf on 14.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement  entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementDetailController', LogisticSettlementDetailController);

	LogisticSettlementDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'cc74b0044501457194046d47ca7dc2de');
	}

})(angular);