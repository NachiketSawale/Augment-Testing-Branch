/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function(angular){
	'use strict';
	var moduleName = 'sales.wip';
	angular.module(moduleName).factory('salesWipEstLineItemDynamicConfigurationService', salesWipEstLineItemDynamicConfigService);

	salesWipEstLineItemDynamicConfigService.$inject = ['estimateCommonDynamicConfigurationServiceFactory'];


	function salesWipEstLineItemDynamicConfigService(estimateCommonDynamicConfigurationServiceFactory){

		return estimateCommonDynamicConfigurationServiceFactory.getService('salesWipEstimateLineItemUIStandardService');
	}

})(angular);