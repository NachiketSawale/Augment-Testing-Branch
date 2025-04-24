/**
 * Created by chi on 12/21/2021.
 */
(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'businesspartner.main';
	var serviceName = 'businessPartnerEvaluationNumberGenerationSettingsService';
	/**
	 * @ngdoc service
	 * @name businessPartnerEvaluationNumberGenerationSettingsService
	 * @function
	 * @description
	 * businessPartnerEvaluationNumberGenerationSettingsService is the data service for number generation related functionality.
	 */
	angular.module(moduleName).factory(serviceName, ['businesspartnerNumberGenerationSettingsService',
		function (businesspartnerNumberGenerationSettingsService) {
			return businesspartnerNumberGenerationSettingsService.getInstance('evaluation', serviceName);
		}]);
})();
