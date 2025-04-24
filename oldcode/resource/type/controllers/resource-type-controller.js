(function () {
	/* global globals */
	/* global angular */

	'use strict';

	angular.module('resource.type').controller('resourceTypeController',['$scope','platformMainControllerService', 'resourceTypeDataService', 'platformNavBarService', 'resourceTypeTranslationService',
		function ($scope,platformMainControllerService, resourceTypeDataService, platformNavBarService, resourceTypeTranslationService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceTypeDataService, configObject, resourceTypeTranslationService, 'resource.type', options);
			
			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = resourceTypeTranslationService.getTranslate();
			}
			// register translation changed event
			resourceTypeTranslationService.registerUpdates(loadTranslations);
			
			// un-register on destroy
			$scope.$on('$destroy', function () {
				resourceTypeTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(resourceTypeDataService, sidebarReports, resourceTypeTranslationService, options);
			});
		}
	]);
})();
