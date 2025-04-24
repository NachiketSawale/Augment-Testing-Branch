/**
 * Created by Mohit on 03.01.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainObjectBaseSimulationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of scheduling main observation entities.
	 **/
	angular.module(moduleName).controller('schedulingMainObjectBaseSimulationDetailController', SchedulingMainObjectBaseSimulationDetailController);

	SchedulingMainObjectBaseSimulationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainObjectBaseSimulationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9577dd42ec074b6cafa01dfd2608a99d');
	}

})(angular);