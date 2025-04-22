/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesBidBoqConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides layouts for containers of boq used in context of bids
	 */
	angular.module(moduleName).factory('salesBidBoqConfigurationService',
		['salesCommonBoqConfigurationServiceProvider',
			function (salesCommonBoqConfigurationServiceProvider) {
				return salesCommonBoqConfigurationServiceProvider.getInstance('sales.bid.boqdetailform');
			}
		]);
})();
