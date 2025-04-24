// / <reference path="_references.js" />

/* global globals */

(function (angular, window) {
	'use strict';

	/*
	 ** Cloud.Desktop module is created.
	 */
	const moduleName = 'cloud.desktop';

	angular.module(moduleName, ['ui.router', 'cfp.hotkeys', 'platform']);

	angular.module(moduleName).config(['$httpProvider', 'globals', '_', 'mainViewServiceProvider',
		function ($httpProvider, globals, _, mainViewServiceProvider) {
			if (globals.aad.office365ClientId) {  // todo:rei check for valid office365 id, otherwise not enabled
				$httpProvider.interceptors.push('msalOfficeResourceInterceptor');
			} else {
				console.log('Office365 Provider not available', globals.aad);
			}
			let options = {
				loaModulePermission: ['cloudDesktopNavigationPermissionService', function (cloudDesktopNavigationPermissionService) {
					return cloudDesktopNavigationPermissionService.loadModulePermission();
				}]
			};
			mainViewServiceProvider.globalResolves(options);

		}])
		.run(['$templateCache', function ($templateCache) {
			$templateCache.loadTemplateFile('cloud.desktop/templates/sidebar-notification-templates.html');
		}]);

	globals.modules.push(moduleName);

})(angular, window);
