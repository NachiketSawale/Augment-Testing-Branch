/**
 * Created by baf on 28.05.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee skill entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeSkillDetailController', TimekeepingEmployeeSkillDetailController);

	TimekeepingEmployeeSkillDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeSkillDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3a0dc9c87b63405895bbe38caff26e0b');
	}

})(angular);