/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractDocumentValidationService
	 * @description provides validation methods for contract header entities
	 */
	angular.module(moduleName).factory('salesContractDocumentValidationService',
		['salesContractDocumentService', 'salesCommonDocumentServiceProvider',
			function (salesContractDocumentService, salesCommonDocumentServiceProvider) {
				var service = salesCommonDocumentServiceProvider.getValidationInstance(salesContractDocumentService);
				return service;
			}
		]);
})();
