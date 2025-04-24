
(function(angular){
	'use strict';

	var moduleName = 'logistic.job';

	angular.module(moduleName).factory('logisticJobStructureConfigService', ['logisticJobDynamicConfigurationService', function(logisticJobDynamicConfigurationService){
		let service = {};

		function getDtoScheme(){
			return logisticJobDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return logisticJobDynamicConfigurationService.getStandardConfigForStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
