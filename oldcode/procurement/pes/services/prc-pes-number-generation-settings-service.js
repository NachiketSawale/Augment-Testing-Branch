/**
 * Created by pel on 1/9/2019.
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.pes';
	var procurementPesModule = angular.module(moduleName);
	var serviceName = 'procurementPesNumberGenerationSettingsService';

	/**
     * @ngdoc service
     * @name procurementPesNumberGenerationSettingsService
     * @function
     *
     * @description
     * procurementPesNumberGenerationSettingsService is the data service for number genereation related functionality.
     */
	procurementPesModule.factory(serviceName, ['procurementCommonNumberGenerationServiceProvider',
		function (procurementCommonNumberGenerationServiceProvider) {
			return procurementCommonNumberGenerationServiceProvider.getInstance(procurementPesModule, 'pes', serviceName);
		}]);
})();
