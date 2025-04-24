/**
 * Created by lvy on 4/8/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	angular.module(moduleName).controller('procurementRfqSendHistoryDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRfqSendHistoryService',
			'procurementRfqSendHistoryUIStandardService',
			function ($scope, detailControllerService, dataService, uiService) {
				detailControllerService.initDetailController($scope, dataService, null, uiService);
			}]);

})(angular);