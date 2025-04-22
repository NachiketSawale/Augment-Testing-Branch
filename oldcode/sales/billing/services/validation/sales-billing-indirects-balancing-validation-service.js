/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingIndirectBalancingValidationService
	 * @description provides validation methods for Indirect Balancing Configuration
	 */
	angular.module(moduleName).factory('salesBillingIndirectBalancingValidationService',
		['salesBillingService', 'salesBillingItemService', 'salesCommonValidationServiceProvider',
			function (salesBillingService, salesBillingIndirectBalancingService, salesCommonValidationServiceProvider) {
				var service = salesCommonValidationServiceProvider.getInstance(salesBillingIndirectBalancingService);

				// TODO: fill me

				return service;
			}
		]);
})();
