/**
 * Created by leo on 07.05.2018.
 */
(function () {

	'use strict';
	var moduleName = 'timekeeping.employee';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name timekeepingCrewAssignmentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of crew assignment entities.
	 **/
	angModule.controller('timekeepingCrewAssignmentListController', TimekeepingCrewAssignmentListController);

	TimekeepingCrewAssignmentListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingCrewAssignmentListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b89f95becdc44a84ba8cf3f32f2f06cf');
	}
})();