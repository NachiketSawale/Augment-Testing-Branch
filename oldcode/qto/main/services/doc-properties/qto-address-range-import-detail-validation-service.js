(function (angular) {
	'use strict';

	let moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoAddressRangeImportDetailValidationService', ['qtoAddressRangeImportDetailDataService', 'qtoAddressRangeValidationServiceFactory',
		function (dataService, validationServiceFactory) {
			let service = validationServiceFactory.createQtoAddressRangeValidationService(dataService);
			return service;
		}
	]);
})(angular);
