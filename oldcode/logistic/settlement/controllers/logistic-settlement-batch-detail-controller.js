/**
 * Created by baf on 27.06.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementBatchDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement batch entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementBatchDetailController', LogisticSettlementBatchDetailController);

	LogisticSettlementBatchDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementBatchDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fc7ebafbccd14a0f89b6445cf8041d69');
	}

})(angular);