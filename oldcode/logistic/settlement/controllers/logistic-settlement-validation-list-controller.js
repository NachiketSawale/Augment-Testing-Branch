/**
 * Created by baf on 09.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementValidationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic settlement validation entities.
	 **/

	angular.module(moduleName).controller('logisticSettlementValidationListController', LogisticSettlementValidationListController);

	LogisticSettlementValidationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementValidationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'aebd263b496149239676a52a48c94be3');
	}
})(angular);