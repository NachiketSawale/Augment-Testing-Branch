
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.configuration';

	angular.module(moduleName).controller('controllingConfigurationController',
		['$scope', 'platformMainControllerService', 'controllingConfigurationColumnDefinitionDataService','controllingConfigurationTranslationService',
			function ($scope, platformMainControllerService, dataService, controllingConfigurationTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, dataService, mc, controllingConfigurationTranslationService, moduleName, opt);

				let module = angular.module(moduleName);
				platformMainControllerService.registerWizards(module);

				platformMainControllerService.registerReports(module);
				platformMainControllerService.registerTranslation($scope, mc, controllingConfigurationTranslationService);

				function loadTranslations() {
					$scope.translate = controllingConfigurationTranslationService.getTranslate();
				}

				// register translation changed event
				controllingConfigurationTranslationService.registerUpdates(loadTranslations);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(dataService, sidebarReports, controllingConfigurationTranslationService, opt);
				});
			}]);
})();
