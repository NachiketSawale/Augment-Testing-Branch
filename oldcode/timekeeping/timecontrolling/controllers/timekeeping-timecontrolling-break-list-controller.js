(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeControllingBreakListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping timecontrolling break entities.
	 **/

	angular.module(moduleName).controller('timekeepingTimeControllingBreakListController', TimekeepingTimeControllingBreakListController);

	TimekeepingTimeControllingBreakListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeControllingBreakListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '36f4e73f15ab4fc283c9492dcd9fa50c');
	}
})(angular);