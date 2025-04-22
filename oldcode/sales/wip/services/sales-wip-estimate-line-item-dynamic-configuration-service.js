/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function(angular){
	'use strict';
	var moduleName = 'sales.wip';
	/**
	 * @ngdoc service
	 * @name salesWipEstimateLineItemDynamicConfigurationService
	 * @function
	 * @description
	 * Service to get the salesWipEstimateLineItemUIStandardService.
	 **/
	angular.module(moduleName).factory('salesWipEstimateLineItemDynamicConfigurationService', salesWipEstimateLineItemDynamicConfigurationService);

	salesWipEstimateLineItemDynamicConfigurationService.$inject = ['estimateCommonDynamicConfigurationServiceFactory'];


	function salesWipEstimateLineItemDynamicConfigurationService(estimateCommonDynamicConfigurationServiceFactory){

		return estimateCommonDynamicConfigurationServiceFactory.getService('salesWipEstimateLineItemUIStandardService');
	}

})(angular);