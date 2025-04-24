(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.txinterface';

	angular.module(moduleName).controller('procurementTxinterfaceController',
		['$scope', 'globals', 'platformMainControllerService', 'procurementTxinterfaceService', 'platformNavBarService', 'procurementTxinterfaceTranslationService',
			function ($scope, globals, platformMainControllerService, procurementTxinterfaceService, platformNavBarService, procurementTxinterfaceTranslationService) {
				$scope.path = globals.appBaseUrl;

				var options = {search: true, reports: false};
				var configObject = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, procurementTxinterfaceService, configObject, procurementTxinterfaceTranslationService, 'procurement.txinterface', options);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					procurementTxinterfaceTranslationService.unregisterUpdates();
					platformNavBarService.clearActions();
					platformMainControllerService.unregisterCompletely(procurementTxinterfaceService, sidebarReports, procurementTxinterfaceTranslationService, options);
				});
			}]);
})(angular);