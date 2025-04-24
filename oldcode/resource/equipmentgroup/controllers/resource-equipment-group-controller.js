(function () {
	/* global globals */
	/* global angular */

	'use strict';

	angular.module('resource.equipmentgroup').controller('resourceEquipmentgroupController',['$scope','platformMainControllerService', 'resourceEquipmentGroupLookupService', 'resourceEquipmentGroupDataService', 'platformNavBarService', 'resourceEquipmentGroupTranslationService',
		function ($scope,platformMainControllerService, resourceEquipmentGroupLookupService, resourceEquipmentGroupDataService, platformNavBarService, resourceEquipmentGroupTranslationService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceEquipmentGroupDataService, configObject, resourceEquipmentGroupTranslationService, 'resource.type', options);
			// reload lookup data when user enters the module

			resourceEquipmentGroupLookupService.reload();
			// loads or updates translated strings

			function loadTranslations() {
				$scope.translate = resourceEquipmentGroupTranslationService.getTranslate();
			}
			// register translation changed event
			resourceEquipmentGroupTranslationService.registerUpdates(loadTranslations);
			
			// un-register on destroy
			$scope.$on('$destroy', function () {
				resourceEquipmentGroupTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(resourceEquipmentGroupDataService, sidebarReports, resourceEquipmentGroupTranslationService, options);
			});
		}
	]);
})();
