/**
 * Created by Sudarshan on 28.06.2023
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelBreakDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping shiftModel break entities.
	 **/
	angular.module(moduleName).controller('timekeepingShiftModelBreakDetailController', TimekeepingShiftModelBreakDetailController);

	TimekeepingShiftModelBreakDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModelBreakDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0de2fa1dac2c409980fd98dd96063391');
	}

})(angular);