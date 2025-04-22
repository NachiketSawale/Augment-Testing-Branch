/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function(angular){
	'use strict';
	var moduleName = 'sales.billing';
	angular.module(moduleName).factory('salesBillingEstLineItemDynamicConfigurationService', salesBillingEstLineItemDynamicConfigService);

	salesBillingEstLineItemDynamicConfigService.$inject = ['estimateCommonDynamicConfigurationServiceFactory'];


	function salesBillingEstLineItemDynamicConfigService(estimateCommonDynamicConfigurationServiceFactory){

		return estimateCommonDynamicConfigurationServiceFactory.getService('salesBillingEstimateLineItemUIStandardService');
	}

})(angular);