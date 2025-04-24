/**
 * Created by myh on 08/16/2021.
 */

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
	 * @name projectCostCodesDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * projectCostCodesDynamicConfigurationService is the config service for all costcodes views and dynamic columns.
	 */
	angular.module(moduleName).factory('projectCostCodesDynamicConfigurationService', ['basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory',
		function (basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory) {
			return basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory.getService('projectCostCodesStandardConfigurationService', 'projectCostCodesValidationService');
		}
	]);
})(angular);
