/**
 * Created by lsi on 09/08/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	/**
	 * @ngdoc service
	 * @name projectCostCodesPriceListRecordDynConfigService
	 * @function
	 * @description
	 * projectCostCodesPriceListRecordDynConfigService is the config service for wizard 'Update Cost Codes Price' list views and dynamic columns.
	 */
	angular.module(moduleName).factory('projectCostCodesPriceListRecordDynConfigService', ['basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory',
		function (columnDynamicConfigurationServiceFactory) {
			return columnDynamicConfigurationServiceFactory.getService('projectCostCodesPriceListRecordUIStandardService', 'projectCostCodesPriceListRecordValidationService');
		}
	]);
})(angular);