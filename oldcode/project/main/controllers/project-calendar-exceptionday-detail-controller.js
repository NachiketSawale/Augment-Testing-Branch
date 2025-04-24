/**
 * Created by postic on 02.08.2019
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.calendar';

	/**
     * @ngdoc controller
     * @name projectCalendarExceptionDayDetailController
     * @function
     *
     * @description
     * Controller for the detail view of project calendar exception day entities.
     **/

	angular.module(moduleName).controller('projectCalendarExceptionDayDetailController', ProjectCalendarExceptionDayDetailController);

	ProjectCalendarExceptionDayDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectCalendarExceptionDayDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'da054f29c8d04d0aa8f4aa33fb946408');
	}
})(angular);