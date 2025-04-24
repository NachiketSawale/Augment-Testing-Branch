(function () {
	'use strict';

	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceValidationServiceFactory', [
		'platformValidationServiceFactory',
		function (platformValidationServiceFactory) {
			const cache = {};

			function createValidationService(dataService) {
				const validSrv = {};
				platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsProductionPlaceDto',
					moduleSubModule: 'ProductionPlanning.ProductionPlace'
				}, {
					mandatory: ['Code', 'PpsProdPlaceTypeFk', 'BasSiteFk'],
					uniques: ['Code']
				}, validSrv, dataService);
				return validSrv;
			}

			function getValidationService(dataService) {
				const dataServiceName = dataService.getServiceName();
				if(!cache[dataServiceName]){
					cache[dataServiceName] = createValidationService(dataService);
				}
				return cache[dataServiceName];
			}

			return {
				getValidationService: getValidationService
			};
		}
	]);
})();