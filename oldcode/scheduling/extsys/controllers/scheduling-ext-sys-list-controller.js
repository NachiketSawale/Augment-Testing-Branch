/**
 * Created by csalopek on 14.08.2017.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.extsys';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingExtSysCalendarListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of calendar entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingExtSysCalendarListController', SchedulingExtSysCalendarListController);

	SchedulingExtSysCalendarListController.$inject = ['$scope','platformContainerControllerService'];
	function SchedulingExtSysCalendarListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '281b93e2ae5641bb9f644c74d5aefb5b');
	}
})();