/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);
	var serviceName = 'salesBidNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name salesBidNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * salesBidNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	salesBidModule.factory(serviceName, ['salesCommonNumberGenerationServiceProvider',
		function (salesCommonNumberGenerationServiceProvider) {
			return salesCommonNumberGenerationServiceProvider.getInstance(salesBidModule, 'bid', serviceName);
		}]);
})();
