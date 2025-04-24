(function (angular) {
	'use strict';

	const moduleName = 'resource.equipmentgroup';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupDocumentValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupDocumentValidationService', ResourceEquipmentGroupDocumentValidationService);

	ResourceEquipmentGroupDocumentValidationService.$inject = ['_', 'platformDataValidationService','platformRuntimeDataService','resourceEquipmentGroupDocumentDataService'];

	function ResourceEquipmentGroupDocumentValidationService(_, platformDataValidationService, platformRuntimeDataService, resourceEquipmentGroupDocumentDataService) {

		let self = this;
		let dataService = resourceEquipmentGroupDocumentDataService;

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