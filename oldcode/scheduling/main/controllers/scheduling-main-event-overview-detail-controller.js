/**
 * Created by leo on 07.11.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainEventOverviewDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of scheduling event overview entities.
	 **/
	angular.module(moduleName).controller('schedulingMainEventOverviewDetailController', SchedulingMainEventOverviewDetailController);

	SchedulingMainEventOverviewDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainEventOverviewDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5bbf12317b5747a798ba710de91985e7', 'schedulingMainTranslationService');
	}

})(angular);