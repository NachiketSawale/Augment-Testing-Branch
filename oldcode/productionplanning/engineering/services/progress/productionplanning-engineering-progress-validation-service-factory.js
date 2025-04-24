/**
 * Created by zov on 27/06/2019.
 */
(function () {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('ppsEngineeringProgressValidationServiceFactory', ppsEngineeringProgressValidationServiceFactory);
	ppsEngineeringProgressValidationServiceFactory.$inject = ['platformValidationServiceFactory', 'platformDataValidationService',
		'platformRuntimeDataService'];
	function ppsEngineeringProgressValidationServiceFactory(platformValidationServiceFactory, platformDataValidationService,
	                                                        platformRuntimeDataService) {

		var serviceCache = {};

		function create(dataService) {
			var validSrv = {};
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'EngDrwProgReportDto',
					moduleSubModule: 'ProductionPlanning.Engineering'
				}, {
					mandatory: ['PerformanceDate', 'Quantity', 'LgmJobRecvFk', 'BasClerkFk', 'IsManualQuantity', 'UserFlag1', 'UserFlag2']
				},
				validSrv,
				dataService);

			var dataSrv = dataService;
			validSrv.validateQuantity = function(entity, value, model) {
				var res = getQuantityValidationResult(entity.IsManualQuantity, value);
				return platformDataValidationService.finishValidation(res, entity, value, model, validSrv, dataSrv);
			};

			function getQuantityValidationResult(isManualQuantity, quantity) {
				var res = true;
				if (isManualQuantity) {
					if (quantity < 0.000001) {
						res = platformDataValidationService.createErrorObject('productionplanning.engineering.progressManualQtyNotEmpty', {fieldName: 'quantity'});
					}
				}
				return res;
			}

			validSrv.validateIsManualQuantity = function(entity, value, model) {
				// validate quantity
				var qtyValidateResult = getQuantityValidationResult(value, entity.Quantity);
				platformDataValidationService.finishValidation(qtyValidateResult, entity, entity.Quantity, 'Quantity', validSrv, dataSrv);
				platformRuntimeDataService.applyValidationResult(qtyValidateResult, entity, 'Quantity');

				return platformDataValidationService.finishValidation(true, entity, value, model, validSrv, dataSrv);
			};

			return validSrv;
		}

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = create(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})();