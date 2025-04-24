/**
 * Created by jhe on 11/20/2018.
 */
(function () {

	'use strict';

	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).controller('basicsAccountingjournalsController', ['$scope', 'basicsAccountingJournalsMainService', 'basicsAccountingJournalsTranslationService', 'platformNavBarService',
		'platformModalService', 'platformMainControllerService',

		function ($scope, basicsAccountingJournalsMainService, basicsAccountingJournalsTranslationService, platformNavBarService,
			platformModalService, platformMainControllerService) {

			$scope.path = globals.appBaseUrl;

			var options = {search: true, reports: false};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsAccountingJournalsMainService, configObject, basicsAccountingJournalsTranslationService, moduleName, options);

			$scope.translate = {};

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsAccountingJournalsTranslationService.getTranslate();

			}

			// register translation changed event
			basicsAccountingJournalsTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsAccountingJournalsTranslationService.unregisterUpdates();
				platformMainControllerService.unregisterCompletely(basicsAccountingJournalsMainService, sidebarReports, basicsAccountingJournalsTranslationService, options);
			});
		}
	]);
})();