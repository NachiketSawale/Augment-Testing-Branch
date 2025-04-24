// eslint-disable-next-line no-redeclare
/* global angular */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('procurementStockStockTotalDetailController',
		['$scope', 'procurementStockStockTotalDataService','platformDetailControllerService', 'procurementStockStockTotalUIStandardService', 'platformTranslateService',
			function ($scope, dataService,platformDetailControllerService, formConfig, translateService) {

				platformDetailControllerService.initDetailController($scope, dataService,{}, formConfig, translateService);
			}
		]);

})(angular);