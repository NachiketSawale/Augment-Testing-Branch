/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	/* global angular */
	'use strict';
	let moduleName = 'project.costcodes';

	/**
	 * @ngdoc service
	 * @name projectCostCodesJobRateDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * projectCostCodesJobRateDynamicConfigurationService is the config service for all costcodes views and dynamic columns.
	 */
	angular.module(moduleName).factory('projectCostCodesJobRateDynamicConfigurationService', ['basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory',
		function (basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory) {

			return basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory.getService('projectCostCodesJobRateStandardConfigurationService', 'projectCostCodesJobRateValidationService');
		}
	]);
})(angular);
