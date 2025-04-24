(function () {
	/* global globals */
	/* global angular */

	'use strict';

	angular.module('object.main').controller('objectMainController',['$scope','platformMainControllerService', 'objectMainUnitService', 'platformNavBarService', 'objectMainTranslationService','objectMainSidebarWizardService','objectMainDocumentsProjectService','allProjectParkingSpaceObjectUnitDataService',
		function ($scope,platformMainControllerService, objectMainUnitService, platformNavBarService, objectMainTranslationService, objectMainSidebarWizardService, objectMainDocumentsProjectService, allProjectParkingSpaceObjectUnitDataService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, objectMainUnitService, configObject, objectMainTranslationService, 'object.main', options);

			allProjectParkingSpaceObjectUnitDataService.init();

			//Wizard
			objectMainSidebarWizardService.activate();

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = objectMainTranslationService.getTranslate();
			}
			// register translation changed event
			objectMainTranslationService.registerUpdates(loadTranslations);
			// React on changes of the specification only in case of a change

			//register documents project
			objectMainDocumentsProjectService.register();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				objectMainTranslationService.unregisterUpdates();
				objectMainSidebarWizardService.deactivate();
				platformNavBarService.clearActions();
				objectMainDocumentsProjectService.unRegister();
				platformMainControllerService.unregisterCompletely(objectMainUnitService, sidebarReports, objectMainTranslationService, options);
			});
		}
	]);
})();
