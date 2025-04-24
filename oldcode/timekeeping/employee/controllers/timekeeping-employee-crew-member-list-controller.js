/**
 * Created by baf on 20.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeCrewMemberListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee crewMember entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeCrewMemberListController', TimekeepingEmployeeCrewMemberListController);

	TimekeepingEmployeeCrewMemberListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingEmployeeCrewMemberListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '41653191a89a4f279710b2b6bafd8a5b');
	}
})(angular);