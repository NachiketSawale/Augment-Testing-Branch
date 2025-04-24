/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global globals */

	let moduleName = 'basics.textmodules';

	/**
	 * @ngdoc controller
	 * @name basicsTextmodulesController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.textmodules module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsTextmodulesController', ['$scope', '$translate', 'cloudDesktopInfoService', 'basicsTextModulesMainService', 'platformNavBarService', 'basicsTextModulesTranslationService', 'platformMainControllerService',

		function ($scope, $translate, cloudDesktopInfoService, basicsTextModulesMainService, platformNavBarService, basicsTextModulesTranslationService, platformMainControllerService) {

			// Header info
			cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameTextModules'));

			$scope.path = globals.appBaseUrl;

			let options = { search: true, reports: true , auditTrail: 'b334a7962fdc42e7992467789fe65c04'};
			let configObject = {};
			let sidebarReports = platformMainControllerService.registerCompletely($scope, basicsTextModulesMainService, configObject, basicsTextModulesTranslationService, 'basics.currency', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsTextModulesTranslationService.getTranslate();
			}

			// register translation changed event
			basicsTextModulesTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsTextModulesTranslationService.unregisterUpdates();
				//platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(basicsTextModulesMainService, sidebarReports, basicsTextModulesTranslationService, options);
			});
		}
	]);
})();