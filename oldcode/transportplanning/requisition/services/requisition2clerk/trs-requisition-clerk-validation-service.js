(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('trsRequisitionClerkValidationService', [
		'platformValidationServiceFactory', 'trsRequisitionClerkDataService',
		function (platformValidationServiceFactory, dataService) {
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'Requisition2ClerkDto',
					moduleSubModule: 'TransportPlanning.Requisition'
				}, {
					mandatory: ['ClerkFk', 'ClerkRoleFk'],
					periods: [{
						from: 'ValidFrom',
						to: 'ValidTo'
					}]
				},
				this,
				dataService);
		}
	]);
})();