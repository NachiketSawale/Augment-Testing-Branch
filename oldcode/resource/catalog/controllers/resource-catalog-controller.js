/**
 * Created by baf on 27.10.2017
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogController
	 * @function
	 *
	 * @description
	 * Main controller of resource catalog module.
	 **/

	angular.module(moduleName).controller('resourceCatalogController', ResourceCatalogController);

	ResourceCatalogController.$inject = ['$scope', '$translate', 'platformMainControllerService', 'platformNavBarService', 'resourceCatalogDataService', 'resourceCatalogTranslationService'];

	function ResourceCatalogController($scope, $translate, platformMainControllerService, platformNavBarService, resourceCatalogDataService, resourceCatalogTranslationService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceCatalogDataService, configObject, resourceCatalogTranslationService, 'resourcecatalog', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = resourceCatalogTranslationService.getTranslate();
		}

		// register translation changed event
		resourceCatalogTranslationService.registerUpdates(loadTranslations);

		resourceCatalogDataService.loadCatalog();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			resourceCatalogTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(resourceCatalogDataService, sidebarReports, resourceCatalogTranslationService, options);
		});
	}

})(angular);