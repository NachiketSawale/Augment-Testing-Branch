/**
 * Created by lnt on 07/09/2021.
 */

(function (angular) {

	'use strict';
	let moduleName = 'project.assembly';

	/**
	 * @ngdoc service
	 * @name projectAssemblyResourceDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * projectAssemblyResourceDynamicConfigurationService is the config service for project assembly resources container.
	 */
	angular.module(moduleName).factory('projectAssemblyResourceDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {
			return estimateCommonDynamicConfigurationServiceFactory.getService('projectAssemblyResourceConfigurationService', 'projectAssemblyResourceValidationService');
		}
	]);
})(angular);
