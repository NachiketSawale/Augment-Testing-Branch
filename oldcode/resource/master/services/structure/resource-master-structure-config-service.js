
(function(angular){
	'use strict';

	var moduleName = 'resource.master';

	angular.module(moduleName).factory('resourceMasterStructureConfigService', ['resourceMasterDynamicConfigurationService', function(resourceMasterDynamicConfigurationService){
		var service = {};

		function getDtoScheme(){
			return resourceMasterDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return resourceMasterDynamicConfigurationService.getStandardConfigForResourceMasterStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
