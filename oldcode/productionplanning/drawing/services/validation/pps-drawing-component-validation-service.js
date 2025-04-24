/**
 * Created by lav on 4/29/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).service('productionplanningDrawingComponentValidationService', [
		'platformValidationServiceFactory',
		'platformDataValidationService',
		'drawingComponentTypes',
		function (platformValidationServiceFactory,
				  platformDataValidationService,
				  drawingComponentTypes) {
			var serviceCache = {};

			function createValidationService(dataService) {
				var service = {};
				platformValidationServiceFactory.addValidationServiceInterface({
						typeName: 'EngDrawingComponentDto',
						moduleSubModule: 'ProductionPlanning.Drawing'
					}, {
						mandatory: ['EngDrwCompStatusFk', 'EngDrwCompTypeFk', 'BasUomFk', 'Quantity']
					},
					service,
					dataService);
				service.dataService = dataService;

				service.validateMdcMaterialCostCodeFk = function (entity, value, model) {
					var validationResult = true;
					if (entity.EngDrwCompTypeFk === drawingComponentTypes.Material ||
						entity.EngDrwCompTypeFk === drawingComponentTypes.CostCode) {
						validationResult = !!value;
					}
					return platformDataValidationService.finishValidation(validationResult, entity, value, model, service, dataService);
				};

				return service;
			}

			function getService(dataService) {
				var key = dataService.getServiceName();
				if (!serviceCache[key]) {
					serviceCache[key] = createValidationService(dataService);
				}
				return serviceCache[key];
			}

			return {
				getService: getService
			};
		}]);
})();