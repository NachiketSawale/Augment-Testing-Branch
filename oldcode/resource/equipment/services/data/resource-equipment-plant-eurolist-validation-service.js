(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantEurolistValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantEurolistValidationService', ResourceEquipmentPlantEurolistValidationService);

	ResourceEquipmentPlantEurolistValidationService.$inject = ['$http', 'resourceEquipmentPlantEurolistDataService', 'platformRuntimeDataService'];

	function ResourceEquipmentPlantEurolistValidationService($http, resourceEquipmentPlantEurolistDataService, platformRuntimeDataService) {

		var self = this;
	}

})(angular);