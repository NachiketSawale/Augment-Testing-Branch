(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name PpsPlannedQuantityValidationService
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'productionplanning.formulaconfiguration';
	angular.module(moduleName).factory('ppsPlannedQuantityValidationServiceFactory', PpsPlannedQuantityValidationServiceFactory);

	PpsPlannedQuantityValidationServiceFactory.$inject = ['platformDataValidationService', 'ppsPlannedQuantityQuantityTypes', 'ppsCommonCustomColumnsServiceFactory'];

	function PpsPlannedQuantityValidationServiceFactory(platformDataValidationService, ppsPlannedQuantityQuantityTypes, customColumnsServiceFactory) {

		var serviceCache = {};

		const plnQtyTypesOfNoResult = [ppsPlannedQuantityQuantityTypes.Userdefined,
			ppsPlannedQuantityQuantityTypes.Accounting,
			ppsPlannedQuantityQuantityTypes.OnormImport,
			ppsPlannedQuantityQuantityTypes.IronImport];

		const isPlnQtyTypesOfNoResult = (typeId) => {
			return plnQtyTypesOfNoResult.indexOf(typeId)!== -1;
		}

		function getService(dataService) {
			let serviceKey = dataService.getServiceName();
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createByDataService(dataService);
			}
			return serviceCache[serviceKey];
		}

		function createByDataService(dataService) {
			var service = {};

			service.validateBasUomFk = function (entity, value, model) {
				if(entity.PpsPlannedQuantityTypeFk !== ppsPlannedQuantityQuantityTypes.Material &&
					entity.PpsPlannedQuantityTypeFk !== ppsPlannedQuantityQuantityTypes.CostCode){
					return true;
				}
				value = value === 0 ? null : value;
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};
			service.validatePropertyMaterialCostcodeFk = function (entity, value, model) {
				if(isPlnQtyTypesOfNoResult(entity.PpsPlannedQuantityTypeFk)){
					return true;
				}
				value = value === 0 ? null : value;
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			if(dataService.getServiceName() === 'productionplanning.header.parentPlannedQuantity'){
				let customColumnsService = customColumnsServiceFactory.getService(moduleName);
				customColumnsService.addValidations(service, dataService);
			}

			return service;
		}

		return {
			getService: getService
		};
	}
})(angular);
