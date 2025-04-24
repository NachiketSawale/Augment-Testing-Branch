(function () {
	'use strict';
	/*global angular*/

	const moduleName = 'productionplanning.strandpattern';
	angular.module(moduleName).service('productionplanningStrandpattern2materialValidationService', [
		'platformValidationServiceFactory', 'productionplanningStrandpattern2materialDataService',
		function (platformValidationServiceFactory, dataService) {
			let self = this;
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsStrandPattern2MaterialDto',
					moduleSubModule: 'Productionplanning.StrandPattern'
				}, {
					mandatory: ['PpsStrandPatternFk', 'PpsMaterialFk'],
					uniques: ['PpsMaterialFk']
				},
				self,
				dataService);
	}]);
})();