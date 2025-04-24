(function (angular) {
	/* global globals */
	'use strict';

	const equipmentName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantComponentValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(equipmentName).service('resourceEquipmentPlantComponentValidationService', ResourceEquipmentPlantComponentValidationService);

	ResourceEquipmentPlantComponentValidationService.$inject = ['_', '$q', 'platformRuntimeDataService', 'platformDataValidationService','resourceEquipmentPlantComponentDataService'];

	function ResourceEquipmentPlantComponentValidationService(_, $q, platformRuntimeDataService, platformDataValidationService, resourceEquipmentPlantComponentDataService) {

		let self = this;

		self.validateHomeProjectFk = function (entity, value) {
			entity.ProjectLocationFk = null;
			platformRuntimeDataService.readonly(entity, [{ field: 'ProjectLocationFk', readonly: _.isNil(value) }]);

			return true;
		};

		self.validateNfcId = function (entity, value, model) {
			if (!value) {
				return platformDataValidationService.finishValidation(true, entity, value, model, self, resourceEquipmentPlantComponentDataService);
			}

			let components = resourceEquipmentPlantComponentDataService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, components, self, resourceEquipmentPlantComponentDataService);
		};

		self.asyncValidateNfcId = function asyncValidateNfcId(entity, value, model) {
			if (!value) {
				platformDataValidationService.finishValidation(true, entity, value, model, self, resourceEquipmentPlantComponentDataService);
				return $q.when(true);
			}

			if (entity.Version === 0 || entity.NfcId !== value ) {
				return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'resource/equipment/plantcomponent/isNfcUnique', entity, value, model).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, resourceEquipmentPlantComponentDataService);
				});
			}
		};
	}
})(angular);