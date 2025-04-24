/**
 * Created by baf on 06.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelExceptionDayDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping shiftModel exceptionDay entities.
	 **/
	angular.module(moduleName).controller('timekeepingShiftModelExceptionDayDetailController', TimekeepingShiftModelExceptionDayDetailController);

	TimekeepingShiftModelExceptionDayDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModelExceptionDayDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f95528f510124a91a6195954d746ee60');
	}

})(angular);