/**
 * Created by pel on 2/18/2020.
 */
/* global  */
(function () {
	/* global  */
	'use strict';

	var moduleName = 'defect.main';
	var procurementInvoiceModule = angular.module(moduleName);
	var serviceName = 'defectNumberGenerationSettingsService';

	/**
     * @ngdoc service
     * @name defectNumberGenerationSettingsService
     * @function
     *
     * @description
     * defectNumberGenerationSettingsService is the data service for number genereation related functionality.
     */
	procurementInvoiceModule.factory(serviceName, ['defectNumberGenerationServiceProvider',
		function (defectNumberGenerationServiceProvider) {
			return defectNumberGenerationServiceProvider.getInstance(serviceName);
		}]);
})();
