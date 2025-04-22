/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.bid';
	angular.module(moduleName).controller('salesBidMilestoneGridController', [
		'$scope',
		'$translate',
		'procurementContextService',
		'salesCommonMilestoneDataService',
		'salesCommonMilestoneUIStandardService',
		'salesCommonMilestoneValidationService',
		'platformGridControllerService',
		'salesBidService',
		function (
			$scope,
			$translate,
			procurementContextService,
			salesCommonMilestoneDataService,
			salesCommonMilestoneUIStandardService,
			validationService,
			platformGridControllerService,
			salesBidService
		) {
			var gridConfig = {
				columns: []
			};
			var itemName = 'BidMilestone';
			var url = globals.webApiBaseUrl + 'sales/bid/milestone/';
			var dataService = salesCommonMilestoneDataService.getService(salesBidService, url, itemName);
			var schemaOption = {
				typeName: 'BidMilestoneDto',
				moduleSubModule: 'Sales.Bid'
			};
			var uiService = salesCommonMilestoneUIStandardService(schemaOption);
			platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
		}
	]);
})();