/**
 * Created by Sudarshan on 24.03.2023
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc controller
	 * @name timekeepingCertifiedEmployeeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of  certified employee entities.
	 **/
	angular.module(moduleName).controller('timekeepingCertifiedEmployeeDetailController', TimekeepingCertifiedEmployeeDetailController);

	TimekeepingCertifiedEmployeeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingCertifiedEmployeeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2d585d88dc054491922176340016f112');
	}

})(angular);