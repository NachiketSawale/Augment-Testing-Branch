(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).service('ppsNestingValidationService', [
		'platformValidationServiceFactory', 'ppsNestingDataService',
		function (platformValidationServiceFactory, dataService) {
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsNestingDto',
					moduleSubModule: 'Productionplanning.Fabricationunit'
				}, {
					mandatory: ['PpsProductFk'],
				},
				this,
				dataService);
		}
	]);
})();