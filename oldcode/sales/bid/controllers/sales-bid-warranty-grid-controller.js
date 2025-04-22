/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.bid';
	angular.module(moduleName).controller('salesBidWarrantyGridController', [
		'$scope',
		'salesCommonWarrantyDataService',
		'salesCommonWarrantyUIStandardService',
		'salesCommonWarrantyValidationService',
		'platformGridControllerService',
		'salesBidService',
		function (
			$scope,
			salesCommonWarrantyDataService,
			salesCommonWarrantyUIStandardService,
			validationService,
			platformGridControllerService,
			salesBidService
		) {
			var gridConfig = {
				columns: []
			};
			var itemName = 'BidWarranty';
			var url = globals.webApiBaseUrl + 'sales/bid/warranty/';
			var dataService = salesCommonWarrantyDataService.getService(salesBidService, url, itemName);
			var schemaOption = {
				typeName: 'BidWarrantyDto',
				moduleSubModule: 'Sales.Bid'
			};
			var uiService = salesCommonWarrantyUIStandardService(schemaOption);
			platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
		}
	]);
})();