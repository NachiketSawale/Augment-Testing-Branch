(function(angular){
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).factory('projectInfoRequestStructureConfigService', ['projectInfoRequestDynamicConfigurationService', function(projectInfoRequestDynamicConfigurationService){
		let service = {};

		function getDtoScheme(){
			return projectInfoRequestDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return projectInfoRequestDynamicConfigurationService.getStandardConfigForProjectInfoRequestStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
