/**
 * Created by leo on 26.04.2018.
 */
(function () {

	'use strict';
	var moduleName = 'timekeeping.employee';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of employee entities
	 **/
	angModule.controller('timekeepingEmployeeDetailController', TimekeepingEmployeeDetailController);

	TimekeepingEmployeeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6fa7a4435630483b8ffe16d6dbd3d17c');
	}
})();