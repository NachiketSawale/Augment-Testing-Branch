/**
 * Created by leo on 25.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodTransactionListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping transaction  entities.
	 **/

	angular.module(moduleName).controller('timekeepingPeriodTransactionListController', TimekeepingTransactionListController);

	TimekeepingTransactionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTransactionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '940ef410ba484efb97058e0dd40486c1');
	}
})(angular);
