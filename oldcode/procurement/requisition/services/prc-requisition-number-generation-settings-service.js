/**
 * Created by pel on 1/9/2019.
 */

(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.requisition';
	var procurementRequisitionModule = angular.module(moduleName);
	var serviceName = 'procurementRequisitionNumberGenerationSettingsService';

	/**
     * @ngdoc service
     * @name procurementRequisitionNumberGenerationSettingsService
     * @function
     *
     * @description
     * procurementRequisitionNumberGenerationSettingsService is the data service for number genereation related functionality.
     */
	procurementRequisitionModule.factory(serviceName, ['procurementCommonNumberGenerationServiceProvider',
		function (procurementCommonNumberGenerationServiceProvider) {
			return procurementCommonNumberGenerationServiceProvider.getInstance(procurementRequisitionModule, 'requisition', serviceName);
		}]);
})();
