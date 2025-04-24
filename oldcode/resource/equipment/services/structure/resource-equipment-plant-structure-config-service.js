
(function(angular){
	'use strict';

	var moduleName = 'resource.equipment';

	angular.module(moduleName).factory('resourceEquipmentPlantStructureConfigService', ['resourceEquipmentPlantDynamicConfigurationService', function(resourceEquipmentPlantDynamicConfigurationService){
		let service = {};

		function getDtoScheme(){
			return resourceEquipmentPlantDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return resourceEquipmentPlantDynamicConfigurationService.getStandardConfigForResourceEquipmentPlantStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
