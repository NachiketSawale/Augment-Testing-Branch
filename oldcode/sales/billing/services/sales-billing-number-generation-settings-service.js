/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);
	var serviceName = 'salesBillingNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name salesBillingNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * salesBillingNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	salesBillingModule.factory('salesBillingNumberGenerationSettingsService', ['salesCommonNumberGenerationServiceProvider',
		function (salesCommonNumberGenerationServiceProvider) {
			return salesCommonNumberGenerationServiceProvider.getInstance(salesBillingModule, 'billing', serviceName);
		}]);
})();
