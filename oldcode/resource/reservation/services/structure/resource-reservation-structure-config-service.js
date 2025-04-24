
(function(angular){
	'use strict';

	var moduleName = 'resource.reservation';

	angular.module(moduleName).factory('resourceReservationStructureConfigService', ['resourceReservationDynamicConfigurationService', function(resourceReservationDynamicConfigurationService){
		var service = {};

		function getDtoScheme(){
			return resourceReservationDynamicConfigurationService.getDtoScheme();
		}

		function getStandardConfigForListView(){
			return resourceReservationDynamicConfigurationService.getStandardConfigForStructure();
		}

		service.getDtoScheme = getDtoScheme;
		service.getStandardConfigForListView = getStandardConfigForListView;
		return service;
	}]);

})(angular);
