(function () {
	'use strict';
	/*global angular*/

	const moduleName = 'productionplanning.product';
	angular.module(moduleName).service('ppsProductRackassignmentValidationService', [
		'platformValidationServiceFactory', 'ppsProductRackassignmentDataService',
		function (platformValidationServiceFactory, dataService) {
			let self = this;
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'PpsRackAssignDto',
					moduleSubModule: 'ProductionPlanning.Product'
				}, { },
				self,
				dataService);
		}]);
})();