(function () {
	'use strict';

	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceChildrenValidationServiceFactory', [
		'platformValidationServiceFactory',
		function (platformValidationServiceFactory) {
			const cache = {};

			function createValidationService(dataService) {
				const validSrv = {};
				platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsProdPlaceToProdPlaceDto',
					moduleSubModule: 'ProductionPlanning.ProductionPlace'
				}, {
					mandatory: ['PpsProdPlaceChildFk', 'Timestamp']
				},
				validSrv,
				dataService);
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