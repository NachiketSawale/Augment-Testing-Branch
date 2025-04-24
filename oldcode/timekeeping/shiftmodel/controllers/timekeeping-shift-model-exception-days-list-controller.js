/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelExceptionDayListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping shiftModel exceptionDay entities.
	 **/

	angular.module(moduleName).controller('timekeepingShiftModelExceptionDayListController', TimekeepingShiftModelExceptionDayListController);

	TimekeepingShiftModelExceptionDayListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModelExceptionDayListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4188c8efe29248c2a36840edc530b71f');
	}
})(angular);