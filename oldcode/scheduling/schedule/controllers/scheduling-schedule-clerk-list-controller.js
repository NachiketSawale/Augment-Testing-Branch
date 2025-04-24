/**
 * Created by baf on 21.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleClerkListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of scheduling schedule clerk entities.
	 **/

	angular.module(moduleName).controller('schedulingScheduleClerkListController', SchedulingScheduleClerkListController);

	SchedulingScheduleClerkListController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingScheduleClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '468be38b0d104ee58361b7e4395ac82d');
	}
})(angular);