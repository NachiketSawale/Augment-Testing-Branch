/**
 * Created by csalopek on 14.08.2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.extsys';

	/**
	 * @ngdoc controller
	 * @name schedulingExtSysDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of calendar entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingExtSysCalendarDetailController', SchedulingExtSysCalendarDetailController);

	SchedulingExtSysCalendarDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingExtSysCalendarDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fe9fa2d886f643b29ca009bb9fe7ac53', 'schedulingExtSysTranslationService');
	}
})(angular);