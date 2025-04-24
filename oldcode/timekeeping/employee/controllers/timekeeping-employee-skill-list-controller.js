/**
 * Created by baf on 28.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee skill entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeSkillListController', TimekeepingEmployeeSkillListController);

	TimekeepingEmployeeSkillListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeSkillListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a0ce2e3271734b7db3e13b2b6c2ad44a');
	}
})(angular);