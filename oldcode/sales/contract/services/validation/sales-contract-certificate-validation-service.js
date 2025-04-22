/*
* clv
* **/

(function(angular){
	'use strict';

	var moduleName = 'sales.contract';
	angular.module(moduleName).factory('salesOrdCertificateValidationService', salesOrdCertificateValidationService);
	salesOrdCertificateValidationService.$inject = ['salesCommonCertificateValidationService', 'salesContractCertificateDataService'];
	function salesOrdCertificateValidationService(salesCommonCertificateValidationService, dataService){

		return salesCommonCertificateValidationService(dataService);
	}

})(angular);