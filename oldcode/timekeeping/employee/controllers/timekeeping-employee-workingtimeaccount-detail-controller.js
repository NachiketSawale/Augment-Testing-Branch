/**
 * Created by shen on 7/6/2021
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeWorkingTimeAccountDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee working time account entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeWorkingTimeAccountDetailController', TimekeepingEmployeeWorkingTimeAccountDetailController);

	TimekeepingEmployeeWorkingTimeAccountDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeWorkingTimeAccountDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '285614dd3e3847189844bafa8f029f7f');
	}

})(angular);
