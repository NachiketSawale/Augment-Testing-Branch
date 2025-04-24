/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectController
	 * @function
	 *
	 * @description
	 * Main controller of resource project module.
	 **/

	angular.module(moduleName).controller('resourceProjectController', ResourceProjectController);

	ResourceProjectController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'resourceProjectDataService', 'resourceProjectTranslationService','cloudDesktopSidebarService'];

	function ResourceProjectController($scope, platformMainControllerService, platformNavBarService, resourceProjectDataService, resourceProjectTranslationService,cloudDesktopSidebarService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceProjectDataService, configObject, resourceProjectTranslationService, 'resource.project', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = resourceProjectTranslationService.getTranslate();
		}

		// register translation changed event
		resourceProjectTranslationService.registerUpdates(loadTranslations);

		// sidebar | information
		var info = {
			name: cloudDesktopSidebarService.getSidebarIds().info,
			title: 'info',
			type: 'template',
			templateUrl: globals.appBaseUrl + 'resource.project/templates/sidebar-info.html'
		};

		cloudDesktopSidebarService.registerSidebarContainer(info, true);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			resourceProjectTranslationService.unregisterUpdates();
			cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(resourceProjectDataService, sidebarReports, resourceProjectTranslationService, options);
		});
	}

})(angular);