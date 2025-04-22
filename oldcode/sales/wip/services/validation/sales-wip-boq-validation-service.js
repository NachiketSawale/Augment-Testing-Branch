/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipBoqValidationService
	 * @description provides validation methods for boq
	 */
	angular.module(moduleName).factory('salesWipBoqValidationService',
		['salesCommonBoqValidationServiceProvider', 'salesWipBoqService',
			function (salesCommonBoqValidationServiceProvider, salesWipBoqService) {
				var service = salesCommonBoqValidationServiceProvider.getInstance(salesWipBoqService);

				// add specific validation functions here
				// ...

				return service;
			}
		]);

})();
