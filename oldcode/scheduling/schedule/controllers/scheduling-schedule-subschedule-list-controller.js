/**
 * Created by baf on 02.09.2014.
 */
((angular) => {

	'use strict';
	let moduleName = 'scheduling.schedule';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleSubScheduleListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule entities.
	 **/
	angModule.controller('schedulingScheduleSubScheduleListController', SchedulingScheduleEditListController);

	SchedulingScheduleEditListController.$inject = ['$scope','platformContainerControllerService'];
	function SchedulingScheduleEditListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c4e358d939c54ee6aac910b3c06b3e8');
	}
})(angular);
