/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.contract';
	angular.module(moduleName).controller('salesContractMilestoneFormController', [
		'$scope',
		'procurementContextService',
		'platformDetailControllerService',
		'salesCommonMilestoneUIStandardService',
		'salesCommonMilestoneDataService',
		'salesCommonMilestoneValidationService',
		'platformTranslateService',
		'salesContractService',
		function (
			$scope,
			procurementContextService,
			platformDetailControllerService,
			salesCommonMilestoneUIStandardService,
			salesCommonMilestoneDataService,
			validationService,
			platformTranslateService,
			salesContractService
		) {
			var itemName = 'OrdMilestone';
			var url = globals.webApiBaseUrl + 'sales/contract/milestone/';
			var dataService = salesCommonMilestoneDataService.getService(salesContractService, url, itemName);
			var schemaOption = {
				typeName: 'OrdMilestoneDto',
				moduleSubModule: 'Sales.Contract'
			};
			var uiService = salesCommonMilestoneUIStandardService(schemaOption);
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
		}]);
})();