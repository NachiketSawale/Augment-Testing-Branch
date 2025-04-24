(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).service('basSiteClerkValidationService', [
		'platformValidationServiceFactory', 'basSiteClerkDataService',
		function (platformValidationServiceFactory, dataService) {
			platformValidationServiceFactory.addValidationServiceInterface(
				{typeName: 'Site2ClerkDto', moduleSubModule: 'Basics.Site'},
				{
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