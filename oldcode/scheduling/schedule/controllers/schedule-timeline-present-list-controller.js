/**
 * Created by leo on 26.08.2015.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.schedule';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleTimelinePresentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule timeline entities.
	 **/
	angModule.controller('schedulingScheduleTimelinePresentListController', SchedulingScheduleTimelinePresentListController);

	SchedulingScheduleTimelinePresentListController.$inject = ['$scope','platformContainerControllerService'];
	function SchedulingScheduleTimelinePresentListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '');
	}
})();