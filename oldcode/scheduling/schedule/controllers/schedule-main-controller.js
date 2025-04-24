/**
 * Created by baf on 24.09.2014.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleMainController
	 * @function
	 *
	 * @description
	 * Main controller for the scheduling.schedule module
	 **/

	angular.module(moduleName).controller('schedulingScheduleMainController', ['$scope', 'schedulingSchedulePresentService', 'platformNavBarService', 'schedulingScheduleTranslationService',

		function ($scope, schedulingSchedulePresentService, platformNavBarService, schedulingScheduleTranslationService) {

			$scope.path = globals.appBaseUrl;

			// Define nav bar actions
			platformNavBarService.getActionByKey('prev').fn = schedulingSchedulePresentService.goToPrev;
			platformNavBarService.getActionByKey('next').fn = schedulingSchedulePresentService.goToNext;

			platformNavBarService.getActionByKey('save').fn = schedulingSchedulePresentService.save;
			platformNavBarService.getActionByKey('refresh').fn = schedulingSchedulePresentService.refresh;

			$scope.translate = {};

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = schedulingScheduleTranslationService.getTranslate();
			}

			// register translation changed event
			schedulingScheduleTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				schedulingScheduleTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
			});
		}
	]);
})(angular);
