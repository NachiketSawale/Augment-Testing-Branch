
(function(angular){
	'use strict';

	var moduleName = 'resource.requisition';

	angular.module(moduleName).factory('resourceRequisitionStructureConfigService', ['resourceRequisitionDynamicConfigurationService', function(resourceRequisitionDynamicConfigurationService){
		var service = {};

		function getDtoScheme(){
			return resourceRequisitionDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return resourceRequisitionDynamicConfigurationService.getStandardConfigForResourceRequisitionStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
