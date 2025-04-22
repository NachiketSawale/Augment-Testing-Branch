/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.contract';
	angular.module(moduleName).controller('salesContractWarrantyFormController', [
		'$scope',
		'procurementContextService',
		'platformDetailControllerService',
		'salesCommonWarrantyUIStandardService',
		'salesCommonWarrantyDataService',
		'salesCommonWarrantyValidationService',
		'platformTranslateService',
		'salesContractService',
		function (
			$scope,
			procurementContextService,
			platformDetailControllerService,
			salesCommonWarrantyUIStandardService,
			salesCommonWarrantyDataService,
			validationService,
			platformTranslateService,
			salesContractService
		) {
			var itemName = 'OrdWarranty';
			var url = globals.webApiBaseUrl + 'sales/contract/warranty/';
			var dataService = salesCommonWarrantyDataService.getService(salesContractService, url, itemName);
			var schemaOption = {
				typeName: 'OrdWarrantyDto',
				moduleSubModule: 'Sales.Contract'
			};
			var uiService = salesCommonWarrantyUIStandardService(schemaOption);
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
		}]);
})();