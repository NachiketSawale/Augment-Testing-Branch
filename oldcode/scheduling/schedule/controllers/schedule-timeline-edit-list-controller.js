/**
 * Created by leo on 26.08.2015.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.schedule';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleTimelineListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule timeline entities.
	 **/
	angModule.controller('schedulingScheduleTimelineEditListController', SchedulingScheduleTimelineEditListController);

	SchedulingScheduleTimelineEditListController.$inject = ['$scope','platformContainerControllerService'];
	function SchedulingScheduleTimelineEditListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'D11B8A235A8646B4AF9C7D317F192973');
	}
})();