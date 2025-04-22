/*
* clv
* **/
(function(angular){
	'use strict';
	var moduleName = 'sales.bid';

	angular.module(moduleName).factory('salesBidCertificateUIStandardService', salesBidCertificateUIStandardService);
	salesBidCertificateUIStandardService.$inject = ['platformSchemaService', 'platformUIStandardConfigService', 'salesCommonCertificateLayout', 'salesBidTranslationService'];
	function salesBidCertificateUIStandardService(platformSchemaService, platformUIStandardConfigService, layout, salesBidTranslationService){

		var certificateDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'BidCertificateDto',
			moduleSubModule: 'Sales.Bid'
		});

		certificateDomainSchema = certificateDomainSchema.properties;
		function UIStandardService(layout, scheme, translateService) {
			platformUIStandardConfigService.call(this, layout, scheme, translateService);
		}

		UIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;

		return new platformUIStandardConfigService(layout, certificateDomainSchema, salesBidTranslationService);
	}
})(angular);