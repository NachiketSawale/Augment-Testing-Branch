(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeControllingBreakDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping timecontrolling break entities.
	 **/
	angular.module(moduleName).controller('timekeepingTimeControllingBreakDetailController', TimekeepingTimeControllingBreakDetailController);

	TimekeepingTimeControllingBreakDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeControllingBreakDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9b148bd082fd4470831c6686a24db1e3');
	}

})(angular);