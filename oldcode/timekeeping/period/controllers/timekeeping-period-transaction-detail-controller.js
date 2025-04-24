/**
 * Created by leo on 25.02.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodTransactionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping transaction  entities.
	 **/
	angular.module(moduleName).controller('timekeepingPeriodTransactionDetailController', TimekeepingTransactionDetailController);

	TimekeepingTransactionDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTransactionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5dbfeadb546b43bc96e46f11201fd918');
	}

})(angular);
