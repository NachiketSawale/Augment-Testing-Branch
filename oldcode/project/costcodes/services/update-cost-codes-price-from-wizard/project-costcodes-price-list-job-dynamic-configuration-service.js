/**
 * Created by lsi on 09/08/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc service
	 * @name projectCostCodesPriceListJobDynConfigService
	 * @function
	 * @description
	 * projectCostCodesPriceListJobDynConfigService is the config service for wizard 'Update Cost Codes Price' list views and dynamic columns.
	 */
	angular.module(moduleName).factory('projectCostCodesPriceListJobDynConfigService', ['basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory',
		function (basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory) {
			return basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory.getService('projectCostCodesPriceListForJobUIStandardService', 'projectCostCodesPriceListForJobValidationService');
		}
	]);
})(angular);