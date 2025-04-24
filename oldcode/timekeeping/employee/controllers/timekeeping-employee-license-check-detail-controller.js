/**
 * Created by chd on 24.03.2025
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeLicenseCheckDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee license check entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeLicenseCheckDetailController', TimekeepingEmployeeLicenseCheckDetailController);

	TimekeepingEmployeeLicenseCheckDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeLicenseCheckDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '709b789198e04428b85ee78a02c63bca');
	}

})(angular);