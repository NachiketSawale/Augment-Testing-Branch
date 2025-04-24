(function () {
	/* global globals */

	'use strict';

	angular.module('resource.reservation').controller('resourceReservationController', ResourceReservationController);

	ResourceReservationController.$inject = ['$scope', 'platformMainControllerService', 'resourceReservationDataService', 'platformNavBarService',
		'resourceReservationTranslationService', 'cloudDesktopSidebarService', 'resourceReservationSynchronisationService'];

	function ResourceReservationController($scope, platformMainControllerService, resourceReservationDataService, platformNavBarService,
		resourceReservationTranslationService, cloudDesktopSidebarService, resourceReservationSynchronisationService) {
		$scope.path = globals.appBaseUrl;

		var options = {search: true, reports: true};
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceReservationDataService, configObject, resourceReservationTranslationService, 'resource.reservation', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = resourceReservationTranslationService.getTranslate();
		}

		// register translation changed event
		resourceReservationTranslationService.registerUpdates(loadTranslations);

		// sidebar | information
		var info = {
			name: cloudDesktopSidebarService.getSidebarIds().info,
			title: 'info',
			type: 'template',
			templateUrl: globals.appBaseUrl + 'resource.reservation/templates/sidebar-info.html'
		};

		cloudDesktopSidebarService.registerSidebarContainer(info, true);
		resourceReservationSynchronisationService.startWatching();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			resourceReservationSynchronisationService.stopWatching();
			resourceReservationTranslationService.unregisterUpdates();
			cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
			platformNavBarService.clearActions();
			platformMainControllerService.unregisterCompletely(resourceReservationDataService, sidebarReports, resourceReservationTranslationService, options);
		});
	}
})();
