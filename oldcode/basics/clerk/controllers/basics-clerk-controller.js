/**
 * Created by baf on 04.09.2014.
 */

(function (angular) {
/*global globals*/
	'use strict';

	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkMainController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.clerk module
	 **/

	angular.module(moduleName).controller('basicsClerkController', ['$scope', 'platformMainControllerService', 'basicsClerkMainService', 'platformNavBarService', 'basicsClerkTranslationService', 'platformModalService', 'basicsClerkSidebarWizardService',

		function ($scope, platformMainControllerService, basicsClerkMainService, platformNavBarService, basicsClerkTranslationService, platformModalService, basicsClerkSidebarWizardService) {

			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true , auditTrail: '80f94c71e3e74812a74a2e8bb6357da9'};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsClerkMainService, configObject, basicsClerkTranslationService, moduleName, options);


			basicsClerkSidebarWizardService.activate();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsClerkTranslationService.unregisterUpdates();
				basicsClerkSidebarWizardService.deactivate();
				//platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(basicsClerkMainService, sidebarReports, basicsClerkTranslationService, options);
			});
		}
	]);
})(angular);
