/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.billingschema';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsBillingSchemaController',
		['$scope', 'globals', 'platformMainControllerService', 'platformNavBarService', 'basicsBillingSchemaService', 'basicsBillingschemaTranslationService', 'cloudDesktopSidebarService',
			function ($scope, globals, platformMainControllerService, platformNavBarService, basicsBillingSchemaService, basicsBillingschemaTranslationService, cloudDesktopSidebarService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: false, reports: false, auditTrail: '688296bbc2654ed4868237158e4935bf'};
				var mc = {};

				var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsBillingSchemaService, mc, basicsBillingschemaTranslationService, moduleName, opt);
				cloudDesktopSidebarService.onExecuteSearchFilter.register(basicsBillingSchemaService.executeSearchFilter);
				basicsBillingSchemaService.registerSidebarFilter();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(basicsBillingSchemaService, sidebarReports, basicsBillingschemaTranslationService, opt);
					cloudDesktopSidebarService.onExecuteSearchFilter.unregister(basicsBillingSchemaService.executeSearchFilter);
				});
			}
		]);
})(angular);