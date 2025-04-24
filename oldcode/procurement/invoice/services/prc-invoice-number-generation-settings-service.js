/**
 * Created by pel on 1/2/2019.
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.invoice';
	var procurementInvoiceModule = angular.module(moduleName);
	var serviceName = 'procurementInvoiceNumberGenerationSettingsService';

	/**
     * @ngdoc service
     * @name procurementInvoiceNumberGenerationSettingsService
     * @function
     *
     * @description
     * procurementInvoiceNumberGenerationSettingsService is the data service for number genereation related functionality.
     */
	procurementInvoiceModule.factory(serviceName, ['procurementCommonNumberGenerationServiceProvider',
		function (procurementCommonNumberGenerationServiceProvider) {
			return procurementCommonNumberGenerationServiceProvider.getInstance(procurementInvoiceModule, 'invoice', serviceName);
		}]);
})();
