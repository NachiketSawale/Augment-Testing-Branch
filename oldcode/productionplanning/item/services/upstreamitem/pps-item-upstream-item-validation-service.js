/**
 * Created by lav on 12/9/2019.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsUpstreamItemValidationService', ValidationService);

	ValidationService.$inject = ['platformValidationServiceFactory', 'platformDataValidationService', 'upstreamTypes'];

	function ValidationService(platformValidationServiceFactory, platformDataValidationService, upstreamTypes) {

		function createValidationService(dataService) {
			var service = {};
			platformValidationServiceFactory.addValidationServiceInterface(
				{
					typeName: 'PpsUpstreamItemDto',
					moduleSubModule: 'ProductionPlanning.Item'
				},
				{
					mandatory: ['PpsUpstreamGoodsTypeFk', 'UpstreamGoods', 'Quantity', 'UomFk']
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

			return service;
		}

		var serviceCache = {};

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
	}

})();