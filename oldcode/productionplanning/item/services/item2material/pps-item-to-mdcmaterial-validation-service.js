/**
 * Created by lav on 12/10/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItem2MdcMaterialValidationService', ValidationService);

	ValidationService.$inject = ['platformValidationServiceFactory'];

	function ValidationService(platformValidationServiceFactory) {

		function createValidationService(dataService) {
			var service = {};
			platformValidationServiceFactory.addValidationServiceInterface(
				{
					typeName: 'PpsItem2MdcMaterialDto',
					moduleSubModule: 'ProductionPlanning.Item'
				},
				{
					mandatory: ['MdcMaterialFk'],
					uniques: ['MdcMaterialFk']
				},
				service,
				dataService);
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