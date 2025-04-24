(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'project.location';

	angular.module(moduleName).controller('projectLocationController', ['$scope', 'projectLocationMainService', 'platformNavBarService', 'projectLocationTranslationService',

		function ($scope, projectLocationMainService, platformNavBarService, projectLocationTranslationService) {

			$scope.path = globals.appBaseUrl;

			// Define nav bar actions
			platformNavBarService.getActionByKey('prev').fn = projectLocationMainService.goToPrevLocation;
			platformNavBarService.getActionByKey('next').fn = projectLocationMainService.goToNextLocation;

			platformNavBarService.getActionByKey('save').fn = projectLocationMainService.saveLocation;
			platformNavBarService.getActionByKey('refresh').fn = projectLocationMainService.reload;


			$scope.translate = {};

			// loads or updates translated strings
			var loadTranslations = function () {
				$scope.translate = projectLocationTranslationService.getTranslate();
			};

			projectLocationTranslationService.loadTranslations();

			// register translation changed event
			projectLocationTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				projectLocationTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
			});
		}
	]);
})(angular);
