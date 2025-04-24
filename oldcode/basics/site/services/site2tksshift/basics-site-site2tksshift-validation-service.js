/**
 * Created by lav on 11/28/2019.
 */
(function () {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2TksShiftValidationService', ValidationService);

	ValidationService.$inject = ['platformValidationServiceFactory',
		'basicsSite2TksShiftDataService'];

	function ValidationService(platformValidationServiceFactory,
							   basicsSite2TksShiftDataService) {
		var service = {};
		platformValidationServiceFactory.addValidationServiceInterface(
			{
				typeName: 'Site2TksShiftDto',
				moduleSubModule: 'Basics.Site'
			},
			{
				mandatory: ['TksShiftFk']
			},
			service,
			basicsSite2TksShiftDataService);
		return service;
	}

})();