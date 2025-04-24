/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseController
	 * @function
	 *
	 * @description
	 * Main controller of resource enterprise module.
	 **/

	angular.module(moduleName).controller('resourceEnterpriseController', ResourceEnterpriseController);

	ResourceEnterpriseController.$inject = ['$scope', 'platformMainControllerService', 'platformNavBarService', 'resourceEnterpriseDispatcherDataService', 'resourceEnterpriseTranslationService','cloudDesktopSidebarService'];

	function ResourceEnterpriseController($scope, platformMainControllerService, platformNavBarService, resourceEnterpriseDispatcherDataService, resourceEnterpriseTranslationService,cloudDesktopSidebarService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: false};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceEnterpriseDispatcherDataService, configObject, resourceEnterpriseTranslationService, 'resource.enterprise', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = resourceEnterpriseTranslationService.getTranslate();
		}

		// register translation changed event
		resourceEnterpriseTranslationService.registerUpdates(loadTranslations);

		// sidebar | information
		var info = {
			name: cloudDesktopSidebarService.getSidebarIds().info,
			title: 'info',
			type: 'template',
			templateUrl: globals.appBaseUrl + 'resource.enterprise/templates/sidebar-info.html'
		};

		cloudDesktopSidebarService.registerSidebarContainer(info, true);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			resourceEnterpriseTranslationService.unregisterUpdates();
			cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(resourceEnterpriseDispatcherDataService, sidebarReports, resourceEnterpriseTranslationService, options);
		});
	}

})(angular);