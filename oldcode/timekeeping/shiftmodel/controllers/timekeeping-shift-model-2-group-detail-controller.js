(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModel2GroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping shiftModel 2Group entities.
	 **/
	angular.module(moduleName).controller('timekeepingShiftModel2GroupDetailController', TimekeepingShiftModel2GroupDetailController);

	TimekeepingShiftModel2GroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingShiftModel2GroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2da1e64a72a64ffca12dd12c1968e88b');
	}

})(angular);