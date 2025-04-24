/**
 * Created by myh on 09/17/2021.
 */

(function (angular) {


	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainConfigTotalDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * estimateMainConfigTotalDynamicConfigurationService is the config service for config total views and dynamic columns.
	 */
	angular.module(moduleName).factory('estimateMainConfigTotalDynamicConfigurationService', [
		'basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory',
		function (basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory) {

			return basicsCommonUserDefinedColumnDynamicConfigurationServiceFactory.getService('estimateMainConfigUiTotalService');
		}
	]);
})(angular);
