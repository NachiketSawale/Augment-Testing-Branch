(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).service('trsRouteClerkValidationService', [
		'platformValidationServiceFactory', 'trsRouteClerkDataService',
		function (platformValidationServiceFactory, dataService) {
			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'Route2ClerkDto',
					moduleSubModule: 'TransportPlanning.Transport'
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