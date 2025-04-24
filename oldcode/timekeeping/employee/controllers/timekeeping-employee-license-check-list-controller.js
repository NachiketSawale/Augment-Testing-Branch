/**
 * Created by chd on 24.03.2025
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeLicenseCheckListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee license check entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeLicenseCheckListController', TimekeepingEmployeeLicenseCheckListController);

	TimekeepingEmployeeLicenseCheckListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeLicenseCheckListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3bcfa94250ea4c57b57fdbddcf59aa79');
	}
})(angular);