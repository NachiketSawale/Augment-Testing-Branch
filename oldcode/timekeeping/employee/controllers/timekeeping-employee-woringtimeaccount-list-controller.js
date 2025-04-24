/**
 * Created by shen on 7/6/2021
 */


(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeWorkingTimeAccountListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee working time account entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeWorkingTimeAccountListController', TimekeepingEmployeeWorkingTimeAccountListController);

	TimekeepingEmployeeWorkingTimeAccountListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeWorkingTimeAccountListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e66a0a6fad844616b5c4c8be9de1c170');
	}
})(angular);
