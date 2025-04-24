
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.invoice';
	angular.module(moduleName).controller('procurementInvoiceAccrualDetailController',
		['$scope', 'platformDetailControllerService', 'procurementInvoiceAccrualDataService', 'procurementInvoiceAccrualUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, {}, uiService, platformTranslateService);
			}]);
})(angular);
