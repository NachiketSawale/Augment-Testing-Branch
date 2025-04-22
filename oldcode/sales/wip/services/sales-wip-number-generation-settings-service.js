/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);
	var serviceName = 'salesWipNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name salesWipNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * salesWipNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	salesWipModule.factory('salesWipNumberGenerationSettingsService', ['salesCommonNumberGenerationServiceProvider',
		function (salesCommonNumberGenerationServiceProvider) {
			return salesCommonNumberGenerationServiceProvider.getInstance(salesWipModule, 'wip', serviceName);
		}]);
})();
