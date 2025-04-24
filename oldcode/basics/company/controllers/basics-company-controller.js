/**
 * Created by henkel on 16.09.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyMainController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.company module
	 **/

	angular.module(moduleName).controller('basicsCompanyController', ['$scope', 'globals', 'platformMainControllerService', 'basicsCompanyMainService', 'basicsCompanyTranslationService', 'cloudDesktopSidebarService', 'basicsCompanySidebarWizardService',

		function ($scope, globals, platformMainControllerService, basicsCompanyMainService, basicsCompanyTranslationService, cloudDesktopSidebarService, basicsCompanySidebarWizardService) {

			$scope.path = globals.appBaseUrl;

			var options = {search: true, reports: true, auditTrail: '32c67b6092884677b810d37c9b5a71b5'};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsCompanyMainService, configObject, basicsCompanyTranslationService, moduleName, options);

			//Wizard
			basicsCompanySidebarWizardService.activate();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsCompanyTranslationService.unregisterUpdates();
				basicsCompanySidebarWizardService.deactivate();
				platformMainControllerService.unregisterNavBar();
				platformMainControllerService.unregisterCompletely(basicsCompanyMainService, sidebarReports, basicsCompanyTranslationService, options);
			});
		}
	]);
})();