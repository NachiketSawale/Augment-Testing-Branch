/**
 * Created by leo on 16.09.2014.
 */

(function () {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarMainController
	 * @function
	 *
	 * @description
	 * Main controller for the scheduling.calendar module
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarController', ['$scope', 'schedulingCalendarMainService', 'platformNavBarService', 'schedulingCalendarTranslationService', 'platformMainControllerService',
		function ($scope, schedulingCalendarMainService, platformNavBarService, schedulingCalendarTranslationService, platformMainControllerService) {

			$scope.path = globals.appBaseUrl;

			var options = { search: false, reports: false };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, schedulingCalendarMainService, configObject, schedulingCalendarTranslationService, globals.appBaseUrl + moduleName, options);

			schedulingCalendarMainService.assertIsLoaded();
			schedulingCalendarMainService.setReadOnlyAtStart();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				schedulingCalendarTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(schedulingCalendarMainService, sidebarReports, schedulingCalendarTranslationService, options);
				schedulingCalendarMainService.setReadOnly(false);
			});
		}
	]);
})();
