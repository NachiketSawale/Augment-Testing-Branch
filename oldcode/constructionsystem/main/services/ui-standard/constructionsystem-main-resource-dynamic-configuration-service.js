/**
 * Created by myh on 01/12/2022.
 */
 
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainResourceDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * constructionsystemMainResourceDynamicConfigurationService is the config service for constructionsysem resoruce.
	 */
	angular.module(moduleName).factory('constructionsystemMainResourceDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {
			let options = {
				dynamicColDictionaryForDetail : {}
			};

			return estimateCommonDynamicConfigurationServiceFactory.getService('constructionsystemMainResourceUIStandardService', 'constructionsystemMainResourceValidationService', options);
		}
	]);
})(angular);