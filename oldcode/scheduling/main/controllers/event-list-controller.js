/**
 * Created by baf on 26.01.2015.
 */
(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';


	/**
	 * @ngdoc controller
	 * @name schedulingMainEventListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of events in scheduling.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingMainEventListController', SchedulingMainEventListController);

	SchedulingMainEventListController.$inject = ['$scope', 'platformContainerControllerService'];
	function SchedulingMainEventListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '578F759AF73E4A6AA22089975D3889AC');
	}

})(angular);