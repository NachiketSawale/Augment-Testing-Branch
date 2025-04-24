/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelWorkingTimeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping shiftModel workingTime entities.
	 **/

	angular.module(moduleName).controller('timekeepingShiftModelWorkingTimeListController', TimekeepingShiftModelWorkingTimeListController);

	TimekeepingShiftModelWorkingTimeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModelWorkingTimeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '370d136ef46d4c13a7b3ce9bf8b1e5e4');
	}
})(angular);