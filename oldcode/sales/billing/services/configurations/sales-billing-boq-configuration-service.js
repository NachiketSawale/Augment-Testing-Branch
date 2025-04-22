/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingBoqConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides layouts for containers of boq used in context of billing
	 */
	angular.module(moduleName).factory('salesBillingBoqConfigurationService',
		['salesCommonBoqConfigurationServiceProvider',
			function (salesCommonBoqConfigurationServiceProvider) {
				return salesCommonBoqConfigurationServiceProvider.getInstance('sales.billing.boqdetailform');
			}
		]);
})();
