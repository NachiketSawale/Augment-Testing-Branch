/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingBoqValidationService
	 * @description provides validation methods for boq
	 */
	angular.module(moduleName).factory('salesBillingBoqValidationService',
		['salesCommonBoqValidationServiceProvider', 'salesBillingBoqService',
			function (salesCommonBoqValidationServiceProvider, salesBillingBoqService) {
				var service = salesCommonBoqValidationServiceProvider.getInstance(salesBillingBoqService);

				// add specific validation functions here
				// ...

				return service;
			}
		]);

})();
