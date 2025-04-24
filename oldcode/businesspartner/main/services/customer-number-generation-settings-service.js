/**
 * Created by lsi on 1/12/2021.
 */
(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */

	'use strict';
	var moduleName = 'businesspartner.main';
	var serviceName = 'customerNumberGenerationSettingsService';
	/**
	 * @ngdoc service
	 * @name customerNumberGenerationSettingsService
	 * @function
	 * @description
	 * customerNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	angular.module(moduleName).factory(serviceName, ['businesspartnerNumberGenerationSettingsService',
		function (businesspartnerNumberGenerationSettingsService) {
			return businesspartnerNumberGenerationSettingsService.getInstance('customer', serviceName);
		}]);
})();
