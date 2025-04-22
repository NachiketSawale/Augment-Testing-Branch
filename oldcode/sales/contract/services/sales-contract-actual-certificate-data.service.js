(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	// business partner actual certificate data service
	angular.module(moduleName).factory('salesContractCertificateActualDataService', ['businesspartnerCertificateCertificateContainerServiceFactory', 'salesContractService',
		function (dataServiceFactory, parentService) {
			return dataServiceFactory.getDataService(moduleName, parentService);
	}]);

})(angular);