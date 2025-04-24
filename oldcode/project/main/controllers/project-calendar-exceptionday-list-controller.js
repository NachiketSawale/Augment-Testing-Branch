/**
 *Created by postic on 02.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarExceptionDayListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project calendar exception day entities.
	 **/

	angular.module(moduleName).controller('projectCalendarExceptionDayListController', ProjectCalendarExceptionDayListController);

	ProjectCalendarExceptionDayListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectCalendarExceptionDayListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ee297e5e837b4d9ab6fe1029874ab1a3');
	}
})(angular);