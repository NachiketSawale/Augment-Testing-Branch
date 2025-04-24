/**
 * Created by baf on 21.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleClerkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of scheduling schedule clerk entities.
	 **/
	angular.module(moduleName).controller('schedulingScheduleClerkDetailController', SchedulingScheduleClerkDetailController);

	SchedulingScheduleClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingScheduleClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9dba09dfec334213bc8cb59ef42ffc27');
	}

})(angular);