/**
 * Created by baf on 17.01.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainObservationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of scheduling main observation entities.
	 **/

	angular.module(moduleName).controller('schedulingMainObservationListController', SchedulingMainObservationListController);

	SchedulingMainObservationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainObservationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f49169c661b34fe8b73e41b4481de43c');
	}
})(angular);