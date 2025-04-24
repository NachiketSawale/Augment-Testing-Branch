/**
 * Created by lsi on 1/12/2021.
 */
(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'businesspartner.main';
	var serviceName = 'supplierNumberGenerationSettingsService';
	/**
	 * @ngdoc service
	 * @name supplierNumberGenerationSettingsService
	 * @function
	 * @description
	 * supplierNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	angular.module(moduleName).factory(serviceName, ['businesspartnerNumberGenerationSettingsService',
		function (businesspartnerNumberGenerationSettingsService) {
			return businesspartnerNumberGenerationSettingsService.getInstance('supplier', serviceName);
		}]);
})();
