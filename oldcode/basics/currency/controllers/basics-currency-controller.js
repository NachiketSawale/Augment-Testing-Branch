/**
 * Created by joshi on 18.11.2014.
 */

(function (angular) {
	/* global globals */

	'use strict';

	var moduleName = 'basics.currency';

	/**
	 * @ngdoc controller
	 * @name basicsCurrencyMainController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.currency module
	 **/

	angular.module(moduleName).controller('basicsCurrencyController', ['$scope', 'basicsCurrencyMainService', 'platformNavBarService', 'basicsCurrencyTranslationService', 'platformMainControllerService',

		function ($scope, basicsCurrencyMainService, platformNavBarService, basicsCurrencyTranslationService, platformMainControllerService) {
			$scope.path = globals.appBaseUrl;

			var options = { search: false, reports: true , auditTrail: 'e05c00a1b684441d8b0d73cce658974c'};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsCurrencyMainService, configObject, basicsCurrencyTranslationService, 'basics.currency', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsCurrencyTranslationService.getTranslate();
			}

			// register translation changed event
			basicsCurrencyTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsCurrencyTranslationService.unregisterUpdates();
				//platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(basicsCurrencyMainService, sidebarReports, basicsCurrencyTranslationService, options);
			});
		}
	]);
})(angular);