(function(angular){
	'use strict';

	var moduleName = 'basics.pricecondition';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsPriceConditionController',
		['$scope', 'platformMainControllerService', 'platformNavBarService', 'basicsPriceConditionDataService', 'basicsPriceConditionTranslationService', 'cloudDesktopSidebarService',
			function ($scope, platformMainControllerService, platformNavBarService, basicsPriceConditionDataService, basicsPriceConditionTranslationService, cloudDesktopSidebarService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: false, reports: false};
				var mc = {};

				var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsPriceConditionDataService, mc, basicsPriceConditionTranslationService, moduleName, opt);
				cloudDesktopSidebarService.onExecuteSearchFilter.register(basicsPriceConditionDataService.executeSearchFilter);


				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(basicsPriceConditionDataService, sidebarReports, basicsPriceConditionTranslationService, opt);
					cloudDesktopSidebarService.onExecuteSearchFilter.unregister(basicsPriceConditionDataService.executeSearchFilter);
				});
			}]);
})(angular);