/**
 * Created by jhe on 7/23/2018.
 */
(function () {

	'use strict';

	var moduleName = 'basics.regionCatalog';

	/**
     * @ngdoc controller
     * @name basicsRegionCatalogController
     * @function
     *
     * @description
     * Main controller for the basics.RegionCatalog module
     **/

	angular.module(moduleName).controller('basicsRegionCatalogController', ['$scope', 'basicsRegionTypeMainService', 'basicsRegionCatalogTranslationService', 'platformNavBarService',
		'platformModalService', 'platformMainControllerService', 'basicsRegionCatalogSidebarWizardService',

		function ($scope, basicsRegionTypeMainService, basicsRegionCatalogTranslationService, platformNavBarService,
			platformModalService, platformMainControllerService, basicsRegionCatalogSidebarWizardService) {

			$scope.path = globals.appBaseUrl;

			var options = {search: false, reports: false};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsRegionTypeMainService, configObject, basicsRegionCatalogTranslationService, moduleName, options);

			$scope.translate = {};

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsRegionCatalogTranslationService.getTranslate();

			}

			//register wizard
			basicsRegionCatalogSidebarWizardService.activate();

			// register translation changed event
			basicsRegionCatalogTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsRegionCatalogTranslationService.unregisterUpdates();
				basicsRegionCatalogSidebarWizardService.deactivate();
				platformMainControllerService.unregisterCompletely(basicsRegionTypeMainService, sidebarReports, basicsRegionCatalogTranslationService, options);
			});
		}
	]);
})();