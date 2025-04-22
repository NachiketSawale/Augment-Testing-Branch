/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractBoqValidationService
	 * @description provides validation methods for boq
	 */
	angular.module(moduleName).factory('salesContractBoqValidationService',
		['salesCommonBoqValidationServiceProvider', 'salesContractBoqService',
			function (salesCommonBoqValidationServiceProvider, salesContractBoqService) {
				var service = salesCommonBoqValidationServiceProvider.getInstance(salesContractBoqService);

				// add specific validation functions here
				// ...

				return service;
			}
		]);

})();
