/**
 * Created by csalopek on 14.08.2017.
 */

(function () {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.extsys';

	/**
	 * @ngdoc controller
	 * @name schedulingExtSysMainController
	 * @function
	 *
	 * @description
	 * Main controller for the scheduling.extsys module
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingExtsysController', ['$scope', 'schedulingExtSysCalendarService', 'platformNavBarService', 'schedulingExtSysTranslationService', 'platformMainControllerService',
		function ($scope, schedulingExtSysCalendarService, platformNavBarService, schedulingExtSysTranslationService, platformMainControllerService) {

			$scope.path = globals.appBaseUrl;

			var options = { search: false, reports: false };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, schedulingExtSysCalendarService, configObject, schedulingExtSysTranslationService, globals.appBaseUrl + moduleName, options);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				schedulingExtSysTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(schedulingExtSysCalendarService, sidebarReports, schedulingExtSysTranslationService, options);
			});
		}
	]);
})();
