(function () {
	'use strict';
	/*global angular*/

	const moduleName = 'productionplanning.strandpattern';
	angular.module(moduleName).service('productionplanningStrandpatternValidationService', [
		'platformValidationServiceFactory', 'productionplanningStrandpatternDataService',
		function (platformValidationServiceFactory, dataService) {
			let self = this;
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsStrandPatternDto',
					moduleSubModule: 'Productionplanning.StrandPattern'
				}, {
					mandatory: ['Code'],
					uniques: ['Code']
				},
				self,
				dataService);
	}]);
})();