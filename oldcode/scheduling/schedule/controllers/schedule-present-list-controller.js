/**
 * Created by baf on 02.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.schedule';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingSchedulePresentListController', SchedulingSchedulePresentListController);

	SchedulingSchedulePresentListController.$inject = ['$scope','platformContainerControllerService','schedulingScheduleLookupService'];
	function SchedulingSchedulePresentListController($scope, platformContainerControllerService, schedulingScheduleLookupService) {

		schedulingScheduleLookupService.getCalendarList().then(function () {
			schedulingScheduleLookupService.getProjectList().then(function () {
				if (angular.isDefined($scope.gridCtrl) && angular.isDefined($scope.gridCtrl.refresh)) {
					$scope.gridCtrl.refresh();
				}
			});
		});

		platformContainerControllerService.initController($scope, moduleName, '');
	}
})();