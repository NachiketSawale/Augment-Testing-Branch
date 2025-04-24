/**
 * Created by shen on 9/16/2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeWorkingTimeModelDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee workingtimemodel entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeWorkingTimeModelDetailController', TimekeepingEmployeeWorkingTimeModelDetailController);

	TimekeepingEmployeeWorkingTimeModelDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeWorkingTimeModelDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0eb6d19bf95546af8792202826993c7b');
	}

})(angular);
