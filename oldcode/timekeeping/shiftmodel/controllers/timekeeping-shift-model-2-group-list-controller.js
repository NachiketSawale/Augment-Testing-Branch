(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftMode2GroupListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping shiftModel 2 group entities.
	 **/

	angular.module(moduleName).controller('timekeepingShiftModel2GroupListController', TimekeepingShiftModel2GroupListController);

	TimekeepingShiftModel2GroupListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModel2GroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7809c35d6f0840fe83d3637f62d41138');
	}
})(angular);