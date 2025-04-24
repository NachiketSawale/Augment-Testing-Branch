

(function (angular) {

	'use strict';

	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerGuaranteeUsedUIStandardService', ['platformSchemaService', 'platformUIStandardConfigService', 'businessPartnerGuaranteeUsedLayout', 'businesspartnerMainTranslationService', 'platformUIStandardExtentService', function (platformSchemaService, PlatformUIStandardConfigService, businessPartnerGuaranteeUsedLayout, businesspartnerMainTranslationService, platformUIStandardExtentService) {
		let domainSchema = platformSchemaService.getSchemaFromCache(
			{typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate'}
		);
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		let service = new PlatformUIStandardConfigService(businessPartnerGuaranteeUsedLayout, domainSchema, businesspartnerMainTranslationService);

		//platformUIStandardExtentService.extend(service, businessPartnerGuarantorLayout.addition, domainSchema);

		return service;
	}]);

})(angular);