(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.plantestimate';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentAssignmentValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourcePlantEstimateEquipmentAssignmentValidationService', ResourcePlantEstimateEquipmentAssignmentValidationService);

	ResourcePlantEstimateEquipmentAssignmentValidationService.$inject = ['$http', 'resourcePlantEstimateEquipmentAssignmentDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ResourcePlantEstimateEquipmentAssignmentValidationService($http, resourcePlantEstimateEquipmentAssignmentDataService, platformDataValidationService) {

		var self = this;

		self.validatePlant2Fk = function (entity, value, model) {
			if(value === 0) {
				value = null;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourcePlantEstimateEquipmentAssignmentDataService);
		};

		self.asyncValidatePlant2Fk = function asyncValidatePlant2Fk(entity, value, model) {
			var identifcationData = {
				Id: value
			};
			return $http.post(globals.webApiBaseUrl + 'resource/equipment/plant/getById', identifcationData).then(function (response) {
				entity.UomFk = response.data.UoMFk;
				return true;
			});
		};
	}

})(angular);