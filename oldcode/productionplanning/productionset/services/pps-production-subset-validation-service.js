(function () {
	'use strict';
	/*globals angular*/

	var moduleName = 'productionplanning.productionset';
	angular.module(moduleName).service('ppsProductionSubsetValidationService', [
		'platformValidationServiceFactory', 'ppsProductionSubsetDataService',
		function (platformValidationServiceFactory, dataService) {
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsProductionSubsetDto',
					moduleSubModule: 'Productionplanning.Fabricationunit'
				}, {
					mandatory: ['PpsProductionSetFk']
				},
				this,
				dataService);
		}
	]);
})();