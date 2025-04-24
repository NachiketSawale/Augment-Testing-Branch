(function (angular) {

	'use strict';

	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleTimelinePresentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingScheduleTimelinePresentDetailController', SchedulingScheduleTimelinePresentDetailController);

	SchedulingScheduleTimelinePresentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingScheduleTimelinePresentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '', 'schedulingScheduleTranslationService');
	}
})(angular);