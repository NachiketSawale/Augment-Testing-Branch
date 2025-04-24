/**
 * Created by pel on 12/21/2018.
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.contract';
	var procurementContractModule = angular.module(moduleName);
	var serviceName = 'procurementContractNumberGenerationSettingsService';

	/**
     * @ngdoc service
     * @name procurementContractNumberGenerationSettingsService
     * @function
     *
     * @description
     * procurementContractNumberGenerationSettingsService is the data service for number genereation related functionality.
     */
	procurementContractModule.factory(serviceName, ['procurementCommonNumberGenerationServiceProvider',
		function (procurementCommonNumberGenerationServiceProvider) {
			return procurementCommonNumberGenerationServiceProvider.getInstance(procurementContractModule, 'contract', serviceName);
		}]);
})();
