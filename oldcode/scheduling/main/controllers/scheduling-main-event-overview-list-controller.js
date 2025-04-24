/**
 * Created by leo on 07.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainEventOverviewListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of scheduling event overview entities.
	 **/

	angular.module(moduleName).controller('schedulingMainEventOverviewListController', SchedulingMainEventOverviewListController);

	SchedulingMainEventOverviewListController.$inject = ['$scope', 'platformContainerControllerService', 'schedulingMainEventOverviewService'];

	function SchedulingMainEventOverviewListController($scope, platformContainerControllerService, schedulingMainEventOverviewService) {
		platformContainerControllerService.initController($scope, moduleName, 'c8f5680d634941bdaa5be432ae25c082');
		schedulingMainEventOverviewService.load();
	}
})(angular);