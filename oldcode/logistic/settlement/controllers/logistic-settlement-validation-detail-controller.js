/**
 * Created by baf on 09.04.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementValidationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic settlement validation entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementValidationDetailController', LogisticSettlementValidationDetailController);

	LogisticSettlementValidationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSettlementValidationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '953e98ce9064458f873465b10d75533a');
	}

})(angular);