/**
 * Created by nit on 07.05.2018.
 */
(function () {
	/* global globals */

	'use strict';

	angular.module('timekeeping.timesymbols').controller('timekeepingTimesymbolsController', ['$scope', 'platformMainControllerService', 'timekeepingTimeSymbolsDataService', 'platformNavBarService', 'timekeepingTimeSymbolsTranslationService',
		function ($scope, platformMainControllerService, timekeepingTimeSymbolsDataService, platformNavBarService, timekeepingTimeSymbolsTranslationService) {
			$scope.path = globals.appBaseUrl;

			let options = {search: true, reports: true};
			let configObject = {};
			let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingTimeSymbolsDataService, configObject, timekeepingTimeSymbolsTranslationService, 'timekeeping.timesymbols', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = timekeepingTimeSymbolsTranslationService.getTranslate();
			}

			// register translation changed event
			timekeepingTimeSymbolsTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				timekeepingTimeSymbolsTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(timekeepingTimeSymbolsDataService, sidebarReports, timekeepingTimeSymbolsTranslationService, options);
			});
		}
	]);
})();
