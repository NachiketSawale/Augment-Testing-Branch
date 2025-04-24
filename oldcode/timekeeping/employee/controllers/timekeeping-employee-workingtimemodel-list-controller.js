/**
 * Created by shen on 9/16/2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeWorkingTimeModelListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee workingtimemodel entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeWorkingTimeModelListController', TimekeepingEmployeeWorkingTimeModelListController);

	TimekeepingEmployeeWorkingTimeModelListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeWorkingTimeModelListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '67b5049e07304887abe0d7b29fcf20e3');
	}
})(angular);
