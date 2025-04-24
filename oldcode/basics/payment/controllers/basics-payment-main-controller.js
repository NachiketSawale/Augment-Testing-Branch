(function () {
	'use strict';

	angular.module('basics.payment').controller('basicsPaymentController', ['$scope', 'globals', 'platformMainControllerService', 'basicsPaymentMainService', 'platformNavBarService', 'basicsPaymentTranslationService',
		function ($scope, globals, platformMainControllerService, basicsPaymentMainService, platformNavBarService, basicsPaymentTranslationService) {
			$scope.path = globals.appBaseUrl;

			var options = {search: true, reports: true};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsPaymentMainService, configObject, basicsPaymentTranslationService, globals.appBaseUrl + 'basics.payment', options);


			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsPaymentTranslationService.unregisterUpdates();

				//platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(basicsPaymentMainService, sidebarReports, basicsPaymentTranslationService, options);
			});
		}
	]);
})();
