/**
 * Created by leo on 26.04.2018.
 */
(function () {
	/* global globals */
	'use strict';

	angular.module('timekeeping.employee').controller('timekeepingEmployeeController', ['$scope', 'platformMainControllerService', 'platformNavBarService',
		'timekeepingEmployeeDataService', 'timekeepingEmployeeTranslationService', 'timekeepingEmployeeDefaultCostGroupService', 'timekeepingPlannedAbsenceCostGroupService',
		function ($scope, platformMainControllerService, platformNavBarService, timekeepingEmployeeDataService, timekeepingEmployeeTranslationService, timekeepingEmployeeDefaultCostGroupService, timekeepingPlannedAbsenceCostGroupService) {
			$scope.path = globals.appBaseUrl;

			var options = {search: true, reports: true};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingEmployeeDataService, configObject, timekeepingEmployeeTranslationService, 'timekeeping.employee', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = timekeepingEmployeeTranslationService.getTranslate();
			}

			// register translation changed event
			timekeepingEmployeeTranslationService.registerUpdates(loadTranslations);

			timekeepingEmployeeDefaultCostGroupService.init();
			timekeepingPlannedAbsenceCostGroupService.init();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				timekeepingEmployeeTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(timekeepingEmployeeDataService, sidebarReports, timekeepingEmployeeTranslationService, options);
			});
		}
	]);
})();
