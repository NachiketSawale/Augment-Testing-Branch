/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractBoqConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides layouts for containers of boq used in context of contracts
	 */
	angular.module(moduleName).factory('salesContractBoqConfigurationService',
		['salesCommonBoqConfigurationServiceProvider',
			function (salesCommonBoqConfigurationServiceProvider) {
				return salesCommonBoqConfigurationServiceProvider.getInstance('sales.contract.boqdetailform');
			}
		]);
})();
