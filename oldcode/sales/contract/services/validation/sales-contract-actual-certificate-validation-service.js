(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';
	
	// business partner actual certificate validation service
	angular.module(moduleName).factory('salesContractCertificateActualValidationService',
	['salesContractCertificateActualDataService', 'businesspartnerCertificateCertificateValidationServiceFactory',
		function (dataService, validationServiceFactory) {
			return validationServiceFactory.create(dataService);
	}]);

}) (angular);