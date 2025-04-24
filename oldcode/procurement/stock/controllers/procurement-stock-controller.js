/**
 * Created by wui on 8/21/2017.
 */

(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	'use strict';

	var moduleName = 'procurement.stock';

	/**
	 * Stock Management Main Controller.
	 */
	angular.module(moduleName).controller('procurementStockController', [
		'$scope',
		'platformNavBarService',
		'platformMainControllerService',
		'procurementContextService',
		'procurementStockHeaderDataService',
		'procurementStockTranslationService',
		function ($scope,
			platformNavBarService,
			platformMainControllerService,
			moduleContext,
			leadingService,
			translateService
		) {
			$scope.path = globals.appBaseUrl;

			var opt = {search: true, reports: false,auditTrail:'f7218889e51746d1b2a95ba240ee1c47'};
			var result = platformMainControllerService.registerCompletely($scope, leadingService, {},
				translateService, moduleName, opt);

			moduleContext.setLeadingService(leadingService);
			moduleContext.setMainService(leadingService);
			leadingService.load();

			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(leadingService, result, translateService, opt);
				// leadingService.unRegisterFilters();
			});
		}
	]);
})();