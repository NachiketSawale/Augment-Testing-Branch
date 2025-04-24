
(function () {
	/* global globals */
	'use strict';

	var moduleName = 'procurement.orderproposals';
	angular.module(moduleName).controller('procurementOrderproposalsController',
		['$scope', 'platformMainControllerService', 'procurementOrderProposalsDataService', 'procurementOrderProposalsTranslationService',
			function procurementOrderProposalsController($scope, platformMainControllerService, leadingService, translateService) {
				$scope.path = globals.appBaseUrl;

				var opt = {search: true, reports: false,auditTrail:'b745a4e7715e419b930c83805561ae2f'};
				var result = platformMainControllerService.registerCompletely($scope, leadingService, {}, translateService, moduleName, opt);

				$scope.$on('$destroy', function destroy() {
					platformMainControllerService.unregisterCompletely(leadingService, result, translateService, opt);
				});
			}]);
})(angular);
