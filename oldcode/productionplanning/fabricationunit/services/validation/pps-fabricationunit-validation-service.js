(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).service('ppsFabricationunitValidationService', [
		'platformValidationServiceFactory', 'ppsFabricationunitDataService',
		function (platformValidationServiceFactory, dataService) {
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsFabricationUnitDto',
					moduleSubModule: 'Productionplanning.Fabricationunit'
				}, {
					mandatory: ['Code', 'ExternalCode', 'BasSiteFk', 'PpsProdPlaceTypeFk', 'EventTypeFk'],
					uniques: ['Code']
				},
				this,
				dataService);
		}
	]);
})();