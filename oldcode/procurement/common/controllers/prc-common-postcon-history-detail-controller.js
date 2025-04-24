/**
 * Created by lvy on 8/6/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonPostconHistoryDetailController',
		['$scope', 'procurementContextService', 'procurementCommonPostconHistoryDataService',
			'platformDetailControllerService', 'procurementCommonPostconHistoryUIStandardService', 'platformTranslateService',
			function ($scope, moduleContext, dataServiceFactory, platformDetailControllerService, itemDetailFormConfig, platformTranslateService) {
				var dataService = dataServiceFactory.getService(moduleContext.getLeadingService());
				platformDetailControllerService.initDetailController($scope, dataService, null, itemDetailFormConfig, platformTranslateService);                  // hidden delete button
				if (!!$scope.formContainerOptions && !!$scope.formContainerOptions.deleteBtnConfig) {
					$scope.formContainerOptions.deleteBtnConfig = undefined;
				}
			}]);
})(angular);