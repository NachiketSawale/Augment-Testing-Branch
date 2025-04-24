(function (angular) {

	'use strict';

	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingSchedulePresentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingSchedulePresentDetailController', SchedulingSchedulePresentDetailController);

	SchedulingSchedulePresentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingSchedulePresentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '', 'schedulingScheduleTranslationService');
	}
})(angular);