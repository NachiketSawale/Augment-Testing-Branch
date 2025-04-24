/**
 * Created by Sudarshan on 28.06.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelBreakListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping shiftmodel break entities.
	 **/

	angular.module(moduleName).controller('timekeepingShiftModelBreakListController', TimekeepingShiftModelBreakListController);

	TimekeepingShiftModelBreakListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModelBreakListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e0004627cb3846fc9071394d96e52702');
	}
})(angular);