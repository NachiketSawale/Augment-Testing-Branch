/**
 * Created by bh on 14.11.2014.
 */
(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainStandardConfigurationService
	 * @function
	 *
	 * @description
	 * boqMainStandardConfigurationService is the configuration service for creating a form container standard config from dto and high level description.
	 */
	angular.module(moduleName).factory('boqMainStandardConfigurationService',
		['boqMainStandardConfigurationServiceFactory',
			function (boqMainStandardConfigurationServiceFactory) {
				return boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService();
			}
		]);
})();