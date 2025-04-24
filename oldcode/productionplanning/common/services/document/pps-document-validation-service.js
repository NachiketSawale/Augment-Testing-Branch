/**
 * Created by anl on 1/4/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonDocumentValidationService', PpsDocumentValidationService);

	PpsDocumentValidationService.$inject = ['platformDataValidationService', 'platformRuntimeDataService'];

	function PpsDocumentValidationService(platformDataValidationService, platformRuntimeDataService) {
		var mainService = {};
		var serviceCache = {};

		mainService.EditValidation = function (dataService) {
			var service = {};

			//validators
			service.validateDocumentTypeFk = function validateDocumentTypeFk(entity, value, model) {
				if (angular.isFunction(dataService.updateReadOnly)) {
					dataService.updateReadOnly(entity, 'DocumentTypeFk');
				}

				var result = platformDataValidationService.isMandatory(value === -1 ? null : value, model, {fieldName: 'document type'});

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

				return result;
			};

			function validateProductDescriptionFkOrEngDrawingFk(entity, value, model, mappingOrigin){
				if (entity.Origin !== mappingOrigin) {
					// remove error of mandatory validation of ProductDescriptionFk or EngDrawingFk
					platformDataValidationService.removeFromErrorList(entity, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(true, entity, model);
				} else {
					let result = platformDataValidationService.isMandatory(value === -1 ? null : value, model, {fieldName: ''});
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				}
			}

			service.validateProductDescriptionFk = function (entity, value, model) {
				return validateProductDescriptionFkOrEngDrawingFk(entity, value, model, 'PRODUCTTEMPLATE');
			};

			service.validateEngDrawingFk = function (entity, value, model) {
				return validateProductDescriptionFkOrEngDrawingFk(entity, value, model, 'DRW');
			};

			return service;
		};

		mainService.getValidationService = function getValidationService(dataService, moduleId) {
			if (!serviceCache[moduleId]) {
				serviceCache[moduleId] = mainService.EditValidation(dataService);
			}
			return serviceCache[moduleId];
		};
		return mainService;
	}
})(angular);