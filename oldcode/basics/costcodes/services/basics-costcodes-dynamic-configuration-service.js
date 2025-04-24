/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCostCodesDynamicConfigurationService is the config service for all costcodes views and dynamic columns.
	 */
	angular.module(moduleName).factory('basicsCostCodesDynamicConfigurationService', [
		'basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory',
		function (basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory) {

			return basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory.getService('basicsCostCodesUIStandardService', 'basicsCostCodesValidationService');
		}
	]);
})(angular);
