(function () {
	/* global globals */
	/* global angular */

	'use strict';

	angular.module('resource.requisition').controller('resourceRequisitionController',['$scope','platformMainControllerService', 'resourceRequisitionDataService', 'platformNavBarService', 'resourceRequisitionTranslationService',
		function ($scope,platformMainControllerService, resourceRequisitionDataService, platformNavBarService, resourceRequisitionTranslationService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceRequisitionDataService, configObject, resourceRequisitionTranslationService, 'resource.requisition', options);
			
			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = resourceRequisitionTranslationService.getTranslate();
			}
			// register translation changed event
			resourceRequisitionTranslationService.registerUpdates(loadTranslations);
			
			// un-register on destroy
			$scope.$on('$destroy', function () {
				resourceRequisitionTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(resourceRequisitionDataService, sidebarReports, resourceRequisitionTranslationService, options);
			});
		}
	]);
})();
