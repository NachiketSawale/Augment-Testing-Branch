/**
 * Created by baf on 20.08.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeCrewMemberDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee crewMember entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeCrewMemberDetailController', TimekeepingEmployeeCrewMemberDetailController);

	TimekeepingEmployeeCrewMemberDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeCrewMemberDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7edfbf3ed45849e5acc2d49cbd2eddb6');
	}

})(angular);