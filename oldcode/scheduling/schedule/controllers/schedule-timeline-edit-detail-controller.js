(function (angular) {

	'use strict';

	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleTimelineEditDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingScheduleTimelineEditDetailController', SchedulingScheduleTimelineEditDetailController);

	SchedulingScheduleTimelineEditDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingScheduleTimelineEditDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6681A59396F24D02A4BEAB2FFF3C735F', 'schedulingScheduleTranslationService');
	}
})(angular);