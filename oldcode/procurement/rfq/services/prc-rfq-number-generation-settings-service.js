/**
 * Created by pel on 1/30/2019.
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.rfq';
	var procurementRfqModule = angular.module(moduleName);
	var serviceName = 'procurementRfqNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name procurementRfqNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * procurementRfqNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	procurementRfqModule.factory(serviceName, ['procurementCommonNumberGenerationServiceProvider',
		function (procurementCommonNumberGenerationServiceProvider) {
			return procurementCommonNumberGenerationServiceProvider.getInstance(procurementRfqModule, 'rfq', serviceName);
		}]);
})();
