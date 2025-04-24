(function () {
	/* global globals */
	/* global angular */

	'use strict';

	angular.module('resource.equipment').controller('resourceEquipmentController',['$scope','platformMainControllerService', 'resourceEquipmentPlantDataService', 'platformNavBarService', 'resourceEquipmentTranslationService',
		function ($scope,platformMainControllerService, resourceEquipmentPlantDataService, platformNavBarService, resourceEquipmentTranslationService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceEquipmentPlantDataService, configObject, resourceEquipmentTranslationService, 'resource.equipment', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = resourceEquipmentTranslationService.getTranslate();
			}
			// register translation changed event
			resourceEquipmentTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				resourceEquipmentTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(resourceEquipmentPlantDataService, sidebarReports, resourceEquipmentTranslationService, options);
			});
		}
	]);
})();
