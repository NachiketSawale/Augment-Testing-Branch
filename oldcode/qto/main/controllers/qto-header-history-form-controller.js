/**
 * Created by lvy on 8/6/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'qto.main';
	angular.module(moduleName).controller('qtoHeaderHistoryDetailController',
		['$scope', 'procurementContextService', 'qtoHeaderHistoryDataService',
			'platformDetailControllerService', 'procurementCommonPostconHistoryUIStandardService', 'platformTranslateService',
			function ($scope, moduleContext, dataService, platformDetailControllerService, itemDetailFormConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, null, itemDetailFormConfig, platformTranslateService);
			}]);
})(angular);