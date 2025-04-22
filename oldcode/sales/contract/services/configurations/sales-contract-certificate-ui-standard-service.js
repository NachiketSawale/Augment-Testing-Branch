/*
* clv
* **/
(function(angular){
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractCertificateUIStandardService', salesContractCertificateUIStandard);
	salesContractCertificateUIStandard.$inject = ['platformSchemaService', 'platformUIStandardConfigService', 'salesCommonCertificateLayout', 'salesContractTranslationService'];
	function salesContractCertificateUIStandard(platformSchemaService, platformUIStandardConfigService, layout, salesContractTranslationService){

		var certificateDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'OrdCertificateDto',
			moduleSubModule: 'Sales.Contract'
		});

		certificateDomainSchema = certificateDomainSchema.properties;
		function UIStandardService(layout, scheme, translateService) {
			platformUIStandardConfigService.call(this, layout, scheme, translateService);
		}

		UIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;

		return new platformUIStandardConfigService(layout, certificateDomainSchema, salesContractTranslationService);
	}
})(angular);