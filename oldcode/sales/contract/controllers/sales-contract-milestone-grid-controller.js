/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.contract';
	angular.module(moduleName).controller('salesContractMilestoneGridController', [
		'$scope',
		'$translate',
		'procurementContextService',
		'salesCommonMilestoneDataService',
		'salesCommonMilestoneUIStandardService',
		'salesCommonMilestoneValidationService',
		'platformGridControllerService',
		'salesContractService',
		function (
			$scope,
			$translate,
			procurementContextService,
			salesCommonMilestoneDataService,
			salesCommonMilestoneUIStandardService,
			validationService,
			platformGridControllerService,
			salesContractService
		) {
			var gridConfig = {
				columns: []
			};
			var itemName = 'OrdMilestone';
			var url = globals.webApiBaseUrl + 'sales/contract/milestone/';
			var dataService = salesCommonMilestoneDataService.getService(salesContractService, url, itemName);
			var schemaOption = {
				typeName: 'OrdMilestoneDto',
				moduleSubModule: 'Sales.Contract'
			};
			var uiService = salesCommonMilestoneUIStandardService(schemaOption);
			platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
		}
	]);
})();