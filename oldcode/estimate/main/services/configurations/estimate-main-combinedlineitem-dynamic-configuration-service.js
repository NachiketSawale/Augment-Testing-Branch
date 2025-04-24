/**
 * Created by mov on 8/27/2019.
 */

(function (angular) {

	/* global_ */
	'use strict';
	var moduleName = 'estimate.main';

	/*
     * @ngdoc service
     * @name estimateMainCombinedLineItemDynamicConfigurationService
     * @function
     *
     * @description
     * estimateMainCombinedLineItemDynamicConfigurationService is the config service for estimate combined line items container.
      */
	angular.module(moduleName).factory('estimateMainCombinedLineItemDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {
			return estimateCommonDynamicConfigurationServiceFactory.getService('estimateMainCombineLineItemConfigurationService', 'estimateMainValidationService', {
				uuid: 'b46b9e121808466da59c0b2959f09960',
				isInitialized: true
			});
		}
	]);
})(angular);
