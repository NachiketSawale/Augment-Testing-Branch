(function (angular) {
	'use strict';
	angular.module('businesspartner.contact').factory('businessPartnerContact2ExternalUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerContact2ExternalLayout', 'businesspartnerContactTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businessPartnerContact2ExternalLayout, businesspartnerContactTranslationService, platformSchemaService) {
				let BaseService = platformUIStandardConfigService;
				let domains = platformSchemaService.getSchemaFromCache({typeName: 'Contact2ExternalDto', moduleSubModule: 'BusinessPartner.Contact'}).properties;
				return new BaseService(businessPartnerContact2ExternalLayout, domains, businesspartnerContactTranslationService);
			}
		]);
})(angular);
