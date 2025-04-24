
(function(angular){
	'use strict';

	var moduleName = 'logistic.settlement';

	angular.module(moduleName).factory('logisticSettlementStructureConfigService', ['logisticSettlementDynamicConfigurationService', function(logisticSettlementDynamicConfigurationService){
		let service = {};

		function getDtoScheme(){
			return logisticSettlementDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return logisticSettlementDynamicConfigurationService.getStandardConfigForStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
