/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingDocumentValidationService
	 * @description provides validation methods for billing header entities
	 */
	angular.module(moduleName).factory('salesBillingDocumentValidationService',
		['salesBillingDocumentService', 'salesCommonDocumentServiceProvider',
			function (salesBillingDocumentService, salesCommonDocumentServiceProvider) {
				var service = salesCommonDocumentServiceProvider.getValidationInstance(salesBillingDocumentService);
				return service;
			}
		]);
})();
