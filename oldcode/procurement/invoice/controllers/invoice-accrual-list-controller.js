/**
 * Created by alm on 1/25/2022.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.invoice';

	angular.module(moduleName).controller('procurementInvoiceAccrualGridController',
		['$scope', '_', 'platformGridAPI', 'platformGridControllerService', 'procurementInvoiceAccrualDataService', 'procurementInvoiceAccrualUIStandardService',
			function ($scope, _, platformGridAPI, platformGridControllerService, dataService, uiService) {

				var myGridConfig = {
					initCalled: false,
					columns: []
				};

				platformGridControllerService.initListController($scope, uiService, dataService, {}, myGridConfig);

			}
		]);
})(angular);