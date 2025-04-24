(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantDocumentValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantDocumentValidationService', ResourceEquipmentPlantDocumentValidationService);

	ResourceEquipmentPlantDocumentValidationService.$inject = ['_','resourceEquipmentPlantDocumentDataService', 'platformDataValidationService','platformRuntimeDataService',];

	function ResourceEquipmentPlantDocumentValidationService(_, resourceEquipmentPlantDocumentDataService, platformDataValidationService, platformRuntimeDataService) {

		let self = this;
		let dataService = resourceEquipmentPlantDocumentDataService;



		// self.validateFile = function (entity, value, model) {
		// 	var items = resourceEquipmentPlantDocumentDataService.getList();
		// 	return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, resourceEquipmentPlantDocumentDataService);
		// };
		self.validateUrl = function (entity, value, model) {
			entity.Url = _.isNil(entity.Url) && _.isNil(value)  ? '' : entity.Url;

			return  !_.isNil(entity.FileArchiveDocFk) ? removeMandatory(entity,value,model)
				: platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
		};

		function removeMandatory(entity, value, model){
			var result = {apply: true, valid: false};
			result.apply = true;
			result.valid = true;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, true, model, dataService, dataService);
			return result;
		}

	}

})(angular);