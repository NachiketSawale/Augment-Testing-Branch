/**
 * Created by henkel
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeSkillDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee skill document entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeSkillDocumentDetailController', TimekeepingEmployeeSkillDocumentDetailController);

	TimekeepingEmployeeSkillDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeSkillDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd8704e0684b047ea949e6785f6a6ee92');
	}

})(angular);