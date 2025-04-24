(function (angular) {

	'use strict';

	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleEditDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingScheduleEditDetailController', SchedulingScheduleEditDetailController);

	SchedulingScheduleEditDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingScheduleEditDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7F2C6C99ACB84BA8B1D455C2ACF93050', 'schedulingScheduleTranslationService');
	}
})(angular);