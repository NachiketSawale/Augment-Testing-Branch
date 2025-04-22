/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);
	var serviceName = 'salesContractNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name salesContractNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * salesContractNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	salesContractModule.factory('salesContractNumberGenerationSettingsService', ['salesCommonNumberGenerationServiceProvider',
		function (salesCommonNumberGenerationServiceProvider) {
			return salesCommonNumberGenerationServiceProvider.getInstance(salesContractModule, 'contract', serviceName);
		}]);
})();
