(function () {
	'use strict';

	angular.module('basics.bank').controller('basicsBankController',['$scope','globals', 'platformMainControllerService', 'basicsBankMainService', 'platformNavBarService', 'basicsBankTranslationService',
		function ($scope, globals, platformMainControllerService, basicsBankMainService, platformNavBarService, basicsBankTranslationService ){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: false, auditTrail: 'c2e322637d134a0fa2b7ddc6db71ccce'};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsBankMainService, configObject, basicsBankTranslationService, 'basics.bank', options);


			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsBankTranslationService.unregisterUpdates();

				//platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(basicsBankMainService, sidebarReports, basicsBankTranslationService, options);
			});
		}
	]);
})();
