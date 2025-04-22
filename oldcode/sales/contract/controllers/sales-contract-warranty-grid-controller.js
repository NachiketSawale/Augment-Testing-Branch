/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.contract';
	angular.module(moduleName).controller('salesContractWarrantyGridController', [
		'$scope',
		'$translate',
		'procurementContextService',
		'salesCommonWarrantyDataService',
		'salesCommonWarrantyUIStandardService',
		'salesCommonWarrantyValidationService',
		'platformGridControllerService',
		'salesContractService',
		function (
			$scope,
			$translate,
			procurementContextService,
			salesCommonWarrantyDataService,
			salesCommonWarrantyUIStandardService,
			validationService,
			platformGridControllerService,
			salesContractService
		) {
			var gridConfig = {
				columns: []
			};
			var itemName = 'OrdWarranty';
			var url = globals.webApiBaseUrl + 'sales/contract/warranty/';
			var dataService = salesCommonWarrantyDataService.getService(salesContractService, url, itemName);
			var schemaOption = {
				typeName: 'OrdWarrantyDto',
				moduleSubModule: 'Sales.Contract'
			};
			var uiService = salesCommonWarrantyUIStandardService(schemaOption);
			platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
		}
	]);
})();