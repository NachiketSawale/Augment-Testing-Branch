/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesBidBoqValidationService
	 * @description provides validation methods for boq
	 */
	angular.module(moduleName).factory('salesBidBoqValidationService',
		['salesCommonBoqValidationServiceProvider', 'salesBidBoqService',
			function (salesCommonBoqValidationServiceProvider, salesBidBoqService) {
				var service = salesCommonBoqValidationServiceProvider.getInstance(salesBidBoqService);

				// add specific validation functions here
				// ...

				return service;
			}
		]);
})();
