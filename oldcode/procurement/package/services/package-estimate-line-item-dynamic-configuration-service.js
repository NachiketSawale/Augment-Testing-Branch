// clv
(function(angular){
	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('packageEstLineItemDynamicConfigurationService', packageEstLineItemDynamicConfigService);

	packageEstLineItemDynamicConfigService.$inject = ['estimateCommonDynamicConfigurationServiceFactory'];


	function packageEstLineItemDynamicConfigService(estimateCommonDynamicConfigurationServiceFactory){

		return estimateCommonDynamicConfigurationServiceFactory.getService('packageEstimateLineitemUIStandardService');
	}

})(angular);