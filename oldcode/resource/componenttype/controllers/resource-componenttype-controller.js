/**
 * Created by baf on 16.11.2017
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.componenttype';

	/**
	 * @ngdoc controller
	 * @name resourceComponenttypeController
	 * @function
	 *
	 * @description
	 * Main controller of resource componenttype module.
	 **/

	angular.module(moduleName).controller('resourceComponenttypeController', ResourceComponentTypeController);

	ResourceComponentTypeController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'resourceComponentTypeDataService', 'resourceComponentTypeTranslationService'];

	function ResourceComponentTypeController($scope, platformMainControllerService, platformNavBarService, resourceComponentTypeDataService, resourceComponentTypeTranslationService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceComponentTypeDataService, configObject, resourceComponentTypeTranslationService, 'resource.componenttype', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = resourceComponentTypeTranslationService.getTranslate();
		}

		// register translation changed event
		resourceComponentTypeTranslationService.registerUpdates(loadTranslations);

		resourceComponentTypeDataService.loadComponentTypes();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			resourceComponentTypeTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(resourceComponentTypeDataService, sidebarReports, resourceComponentTypeTranslationService, options);
		});
	}

})(angular);