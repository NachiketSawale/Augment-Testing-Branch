(function (angular) {
	'use strict';

	var moduleName = 'resource.plantestimate';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentEurolistValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourcePlantEstimateEquipmentEurolistValidationService', ResourcePlantEstimateEquipmentEurolistValidationService);

	ResourcePlantEstimateEquipmentEurolistValidationService.$inject = ['$http', 'resourcePlantEstimateEquipmentEurolistDataService', 'platformRuntimeDataService'];

	function ResourcePlantEstimateEquipmentEurolistValidationService($http, resourcePlantEstimateEquipmentEurolistDataService, platformRuntimeDataService) {

		var self = this;
	}

})(angular);