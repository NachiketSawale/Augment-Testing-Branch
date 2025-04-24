(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'object.project';

	angular.module(moduleName).controller('objectProjectController', ['$scope','platformMainControllerService', 'objectProjectHeaderService', 'platformNavBarService', 'objectMainTranslationService',
		function ($scope,platformMainControllerService, objectProjectHeaderService, platformNavBarService, objectMainTranslationService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, objectProjectHeaderService, configObject, objectMainTranslationService, 'object.main', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = objectMainTranslationService.getTranslate();

			}
			// register translation changed event
			objectMainTranslationService.registerUpdates(loadTranslations);


			// un-register on destroy
			$scope.$on('$destroy', function () {
				objectMainTranslationService.unregisterUpdates();

				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(objectProjectHeaderService, sidebarReports, objectMainTranslationService, options);
			});
		}
	]);
})(angular);
