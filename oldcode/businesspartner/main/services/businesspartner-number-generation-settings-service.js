
(function () {
	/* global angular */
	'use strict';
	let moduleName = 'businesspartner.main';
	let serviceName = 'businesspartnerMainNumberGenerationSettingsService';
	/**
	 * @ngdoc service
	 * @name businesspartnerMainNumberGenerationSettingsService
	 * @function
	 * @description
	 * businesspartnerNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	angular.module(moduleName).factory(serviceName, ['businesspartnerNumberGenerationSettingsService',
		function (businesspartnerNumberGenerationSettingsService) {
			return businesspartnerNumberGenerationSettingsService.getInstance('businesspartner', serviceName);
		}]);
})();
