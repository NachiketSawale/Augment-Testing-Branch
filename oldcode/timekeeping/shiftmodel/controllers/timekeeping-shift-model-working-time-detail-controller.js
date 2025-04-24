/**
 * Created by baf on 06.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelWorkingTimeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping shiftModel workingTime entities.
	 **/
	angular.module(moduleName).controller('timekeepingShiftModelWorkingTimeDetailController', TimekeepingShiftModelWorkingTimeDetailController);

	TimekeepingShiftModelWorkingTimeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModelWorkingTimeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd118689baf94608808fad8c942b565f');
	}

})(angular);