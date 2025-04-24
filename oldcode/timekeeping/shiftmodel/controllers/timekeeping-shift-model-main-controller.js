/**
 * Created by leo on 03.05.2018.
 */
(function () {
	/* global globals */

	'use strict';

	angular.module('timekeeping.shiftmodel').controller('timekeepingShiftmodelController', ['$scope', 'platformMainControllerService', 'timekeepingShiftModelDataService', 'platformNavBarService', 'timekeepingShiftModelTranslationService',
		function ($scope, platformMainControllerService, timekeepingShiftModelDataService, platformNavBarService, timekeepingShiftModelTranslationService) {
			$scope.path = globals.appBaseUrl;

			let options = {search: true, reports: true};
			let configObject = {};
			let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingShiftModelDataService, configObject, timekeepingShiftModelTranslationService, 'timekeeping.shiftmodel', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = timekeepingShiftModelTranslationService.getTranslate();
			}

			// register translation changed event
			timekeepingShiftModelTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				timekeepingShiftModelTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(timekeepingShiftModelDataService, sidebarReports, timekeepingShiftModelTranslationService, options);
			});
		}
	]);
})();
