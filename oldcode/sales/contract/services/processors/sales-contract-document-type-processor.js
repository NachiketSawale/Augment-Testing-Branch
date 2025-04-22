/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	salesContractModule.factory('SalesContractDocumentTypeProcessor',
		['$translate', 'salesCommonTypeDetectionService', function ($translate, salesCommonTypeDetectionService) {
			var service = {};

			var contractTypesService = salesCommonTypeDetectionService.contract;

			service.processItem = function processItem(item) {
				// framework contracts
				if (contractTypesService.isFrameworkContract(item)) {
					item.DocumentType = $translate.instant('sales.contract.docTypeFrameworkContract');
				} else if (contractTypesService.isFrameworkContractCallOff(item)) {
					item.DocumentType = $translate.instant('sales.contract.docTypeFrameworkContractCallOff');
				}
				// basic contracts
				else if (contractTypesService.isSalesOrder(item)) {
					item.DocumentType = $translate.instant('sales.contract.docTypeSalesOrder');
				} else if (contractTypesService.isChangeOrder(item)) {
					item.DocumentType = $translate.instant('sales.contract.docTypeChangeOrder');
				} else if (contractTypesService.isCallOffOrder(item)) {
					item.DocumentType = $translate.instant('sales.contract.docTypeCallOffOrder');
				}
			};

			return service;

		}]);

})();
