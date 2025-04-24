/**
 * Created by myh on 08/16/2021.
 */

(function (angular) {

	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostcodesPriceVersionListRecordDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCostcodesPriceVersionListRecordDynamicConfigurationService is the config service for all costcodes views and dynamic columns.
	 */
	angular.module(moduleName).factory('basicsCostcodesPriceVersionListRecordDynamicConfigurationService', [
		'basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory',
		function (basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory) {

			return basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory.getService('basicsCostCodesPriceVersionListRecordUIStandardService', 'basicsCostCodesPriceVersionListRecordValidationService');
		}
	]);
})(angular);