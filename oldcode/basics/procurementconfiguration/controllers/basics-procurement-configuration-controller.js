/**
 * Created by wuj on 8/25/2015.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementconfigurationController',
		['$scope', 'platformMainControllerService',
			'basicsProcurementConfigHeaderTranslationService', 'basicsProcurementConfigHeaderDataService',
			function ($scope, platformMainControllerService, translateService, mainDataService) {

				var opt = {search: false, reports: false};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, mainDataService, {}, translateService, moduleName, opt);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(mainDataService, sidebarReports, translateService, opt);
				});
			}
		]);
})(angular);

