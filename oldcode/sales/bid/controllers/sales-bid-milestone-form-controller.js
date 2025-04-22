/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.bid';
	angular.module(moduleName).controller('salesBidMilestoneFormController', [
		'$scope',
		'procurementContextService',
		'platformDetailControllerService',
		'salesCommonMilestoneUIStandardService',
		'salesCommonMilestoneDataService',
		'salesCommonMilestoneValidationService',
		'platformTranslateService',
		'salesBidService',
		function (
			$scope,
			procurementContextService,
			platformDetailControllerService,
			salesCommonMilestoneUIStandardService,
			salesCommonMilestoneDataService,
			validationService,
			platformTranslateService,
			salesBidService
		) {
			var itemName = 'BidMilestone';
			var url = globals.webApiBaseUrl + 'sales/bid/milestone/';
			var dataService = salesCommonMilestoneDataService.getService(salesBidService, url, itemName);
			var schemaOption = {
				typeName: 'BidMilestoneDto',
				moduleSubModule: 'Sales.Bid'
			};
			var uiService = salesCommonMilestoneUIStandardService(schemaOption);
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
		}]);
})();