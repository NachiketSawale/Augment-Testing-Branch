((angular) => {

	'use strict';

	let moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleSubScheduleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingScheduleSubScheduleDetailController', SchedulingScheduleEditDetailController);

	SchedulingScheduleEditDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingScheduleEditDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c7281a461e144aeda6478c6b1789a6ee', 'schedulingScheduleTranslationService');
	}
})(angular);
