/**
 * Created by pel on 1/4/2019.
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */

	'use strict';

	var moduleName = 'procurement.package';
	var procurementContractModule = angular.module(moduleName);
	var serviceName = 'procurementPackageNumberGenerationSettingsService';

	/**
     * @ngdoc service
     * @name procurementPackageNumberGenerationSettingsService
     * @function
     *
     * @description
     * procurementPackageNumberGenerationSettingsService is the data service for number genereation related functionality.
     */
	procurementContractModule.factory(serviceName, ['procurementCommonNumberGenerationServiceProvider',
		function (procurementCommonNumberGenerationServiceProvider) {
			return procurementCommonNumberGenerationServiceProvider.getInstance(procurementContractModule, 'package', serviceName);
		}]);
})();