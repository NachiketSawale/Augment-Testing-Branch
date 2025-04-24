(function () {
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).controller('basicsCustomizeController',
		['$scope', 'platformMainControllerService', 'basicsCustomizeTypeDataService', 'basicCustomizeTranslationService','basicsCustomizeLookupConfigurationService','basicsCustomizeStatusTransitionConfigurationService',
			function ($scope, platformMainControllerService, basicsCustomizeTypeDataService, basicCustomizeTranslationService, basicsCustomizeLookupConfigurationService,basicsCustomizeStatusTransitionConfigurationService) {
				$scope.path = globals.appBaseUrl;
				var opt = { search: false, reports: false , auditTrail: '81e8ceca6ab447f093a847bf7049f5e1'};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsCustomizeTypeDataService, mc, basicCustomizeTranslationService, moduleName, opt);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(basicsCustomizeTypeDataService, sidebarReports, basicCustomizeTranslationService, opt);
				});

				basicsCustomizeLookupConfigurationService.loadedSuccessfully();
				basicsCustomizeStatusTransitionConfigurationService.loadedSuccessfully();
			}
		]);
})();