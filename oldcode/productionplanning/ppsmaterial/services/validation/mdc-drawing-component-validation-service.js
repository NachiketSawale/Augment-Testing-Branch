(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name ppsMaterialProductDescParameterValidationService
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('mdcDrawingComponentValidationService', mdcDrawingComponentValidationService);

	mdcDrawingComponentValidationService.$inject = ['platformDataValidationService', 'platformRuntimeDataService',
		'$http', '$q', '$injector'];

	function mdcDrawingComponentValidationService(platformDataValidationService, platformRuntimeDataService,
																				$http, $q, $injector) {

		function createNewComplete(dataService) {
			var service = {};
			service.validateEngDrwCompTypeFk = function (entity, value, model) {
				value = value===0? null : value;
				var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				if(result === true || (result && result.valid === true)){
					if(!_.isNil(entity.EngDrwCompTypeFk)){
						entity.MdcMaterialFk = null;
						entity.MdcCostCodeFk = null;
						entity.MdcMaterialCostCodeFk = null;

						let materialCostCodeFkValdationResult = service.validateMdcMaterialCostCodeFk(entity, entity.MdcMaterialCostCodeFk, 'MdcMaterialCostCodeFk');
						platformRuntimeDataService.applyValidationResult(materialCostCodeFkValdationResult, entity, 'MdcMaterialCostCodeFk');
					}
				}
				return result;
			};
			service.validateMdcMaterialCostCodeFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};
			return service;
		}

		var service = {};

		var serviceCache = {};

		service.getService = function getService(dataService) {
			if (!dataService) {//default data service
				dataService = $injector.get('mdcDrawingComponentDataService');
			}
			var serviceKey = dataService.getServiceName();
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(dataService);
			}
			return serviceCache[serviceKey];
		};

		return service;
	}
})(angular);
