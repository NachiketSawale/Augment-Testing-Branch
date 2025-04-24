/**
 * Created by zwz on 12/16/2020.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningProductEngProdComponentValidationService
	 * @description provides validation methods for EngProdComponent
	 */
	var moduleName = 'productionplanning.product';
	angular.module(moduleName).factory('productionplanningProductEngProdComponentValidationService', ValidationService);

	ValidationService.$inject = ['_', 'platformDataValidationService',
		'drawingComponentTypes',
		'productionplanningProductEngProdComponentDataService'
	];

	function ValidationService(_, platformDataValidationService,
		drawingComponentTypes,
		dataService) {
		var service = {};

		function onEngDrwCompTypeFkChanging (entity) {
			// clear MdcMaterialCostCodeProductFk if EngDrwCompTypeFk changed
			if(!_.isNil(entity.EngDrwCompTypeFk)){
				entity.MdcMaterialCostCodeProductFk = null;
				entity.MdcMaterialFk = null;
				entity.MdcCostCodeFk = null;
				entity.PpsProductOriginFk = null;
			}
		}

		function onMdcMaterialCostCodeProductFkChanging (entity, value) {
			switch (entity.EngDrwCompTypeFk) {
				case drawingComponentTypes.Material:
					entity.MdcMaterialFk = value;
					break;
				case drawingComponentTypes.CostCode:
					entity.MdcCostCodeFk = value;
					break;
				case drawingComponentTypes.Product:
					entity.PpsProductOriginFk = value;
					break;
			}
		}

		service.validateEngDrwCompTypeFk = function(entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if(result === true || (result && result.valid === true)){
				onEngDrwCompTypeFkChanging(entity);
			}
			return result;
		};

		service.validateMdcMaterialCostCodeProductFk = function (entity, value, model) {
			var validationResult = true;
			if (entity.EngDrwCompTypeFk === drawingComponentTypes.Material ||
				entity.EngDrwCompTypeFk === drawingComponentTypes.CostCode ||
				entity.EngDrwCompTypeFk === drawingComponentTypes.Product) {
				validationResult = !!value;
			}

			var result = platformDataValidationService.finishValidation(validationResult, entity, value, model, service, dataService);
			if(result === true || (result && result.valid === true)){
				onMdcMaterialCostCodeProductFkChanging(entity, value);
			}
			return result;
		};

		return service;
	}
})();