/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.bid';
	angular.module(moduleName).controller('salesBidWarrantyFormController', [
		'$scope',
		'platformDetailControllerService',
		'salesCommonWarrantyUIStandardService',
		'salesCommonWarrantyDataService',
		'salesCommonWarrantyValidationService',
		'platformTranslateService',
		'salesBidService',
		function (
			$scope,
			platformDetailControllerService,
			salesCommonWarrantyUIStandardService,
			salesCommonWarrantyDataService,
			validationService,
			platformTranslateService,
			salesBidService
		) {
			var itemName = 'BidWarranty';
			var url = globals.webApiBaseUrl + 'sales/bid/warranty/';
			var dataService = salesCommonWarrantyDataService.getService(salesBidService, url, itemName);
			var schemaOption = {
				typeName: 'BidWarrantyDto',
				moduleSubModule: 'Sales.Bid'
			};
			var uiService = salesCommonWarrantyUIStandardService(schemaOption);
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
		}]);
})();