/**
 * Created by leo on 07.05.2018.
 */
(function () {

	'use strict';
	var moduleName = 'timekeeping.employee';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name timekeepingCrewAssignmentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of crew assignment entities
	 **/
	angModule.controller('timekeepingCrewAssignmentDetailController', TimekeepingCrewAssignmentDetailController);

	TimekeepingCrewAssignmentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingCrewAssignmentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0326e2061c0f45a790536a4741ec137c');
	}
})();