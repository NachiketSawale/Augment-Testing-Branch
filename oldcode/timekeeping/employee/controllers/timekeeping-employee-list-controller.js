/**
 * Created by leo on 26.04.2018.
 */
(function () {

	'use strict';
	var moduleName = 'timekeeping.employee';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of employee entities.
	 **/
	angModule.controller('timekeepingEmployeeListController', TimekeepingEmployeeListController);

	TimekeepingEmployeeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3b47dae9be994a8c8aab95ca3aba7725');
	}
})();