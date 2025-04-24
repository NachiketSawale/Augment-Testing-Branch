
(function(angular){
	'use strict';

	var moduleName = 'logistic.card';

	angular.module(moduleName).factory('logisticCardStructureConfigService', ['logisticCardDynamicConfigurationService', function(logisticCardDynamicConfigurationService){
		let service = {};

		function getDtoScheme(){
			return logisticCardDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return logisticCardDynamicConfigurationService.getStandardConfigForStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
