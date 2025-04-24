/**
 * Created by lav on 12/9/2019.
 */
(function () {
	'use strict';
	let moduleName = 'productionplanning.configuration';

	angular.module(moduleName).service('ppsUpstreamTemplateValidationService', ValidationService);

	ValidationService.$inject = ['platformValidationServiceFactory', 'platformDataValidationService'];

	function ValidationService(platformValidationServiceFactory, platformDataValidationService) {

		function createValidationService(dataService) {
			let service = {};
			platformValidationServiceFactory.addValidationServiceInterface(
				{
					typeName: 'PpsUpstreamItemTemplateDto',
					moduleSubModule: 'ProductionPlanning.Configuration'
				},
				{
					mandatory: ['PpsUpstreamGoodsTypeFk', 'UpstreamGoods', 'Quantity', 'BasUomFk']
				},
				service,
				dataService);

			service.validateUpstreamGoods = function (entity, value, model) {
				if (entity.PpsUpstreamGoodsTypeFk === 5) {
					platformDataValidationService.removeFromErrorList(entity, model, service, dataService);
					return true;
				} else {
					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				}
			};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			return service;
		}

		let serviceCache = {};

		function getService(dataService) {
			let key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createValidationService(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}

})();