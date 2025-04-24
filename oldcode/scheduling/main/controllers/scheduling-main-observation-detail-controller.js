/**
 * Created by baf on 17.01.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainObservationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of scheduling main observation entities.
	 **/
	angular.module(moduleName).controller('schedulingMainObservationDetailController', SchedulingMainObservationDetailController);

	SchedulingMainObservationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainObservationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '862d78af1fc44012bacc390290715b4a');
	}

})(angular);