/**
	 * Created by Sudarshan on 13.03.2023
	 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
		 * @ngdoc controller
		 * @name timekeepingEmployeeDocumentDetailController
		 * @function
		 *
		 * @description
		 * Controller for the detail view of timekeeping employee documents entities.
		 **/
	angular.module(moduleName).controller('timekeepingEmployeeDocumentDetailController', TimekeepingEmployeeDocumentDetailController);

	TimekeepingEmployeeDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '33b305dec16b11edafa10242ac120002');
	}

})(angular);