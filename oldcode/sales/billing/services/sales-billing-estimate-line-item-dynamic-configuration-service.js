/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function(angular){
	'use strict';
	var moduleName = 'sales.billing';
	/**
	 * @ngdoc service
	 * @name salesBillingEstimateLineItemDynamicConfigurationService
	 * @function
	 * @description
	 * Service to get the salesBillingEstimateLineItemUIStandardService.
	 **/
	angular.module(moduleName).factory('salesBillingEstimateLineItemDynamicConfigurationService', salesBillingEstimateLineItemDynamicConfigurationService);

	salesBillingEstimateLineItemDynamicConfigurationService.$inject = ['estimateCommonDynamicConfigurationServiceFactory'];


	function salesBillingEstimateLineItemDynamicConfigurationService(estimateCommonDynamicConfigurationServiceFactory){

		return estimateCommonDynamicConfigurationServiceFactory.getService('salesBillingEstimateLineItemUIStandardService');
	}

})(angular);