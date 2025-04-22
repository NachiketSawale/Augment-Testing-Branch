/*
* clv
* */
(function(angular){
	'use strict';
	var moduleName = 'sales.bid';

	angular.module(moduleName).factory('salesBidCertificateValidationService', salesBidCertificateValidationService);
	salesBidCertificateValidationService.$inject = ['salesCommonCertificateValidationService', 'salesBidCertificateDataService'];
	function salesBidCertificateValidationService(salesCommonCertificateValidationService, dataService){
		return salesCommonCertificateValidationService(dataService);
	}
})(angular);