(function (angular) {
	'use strict';
	angular.module('businesspartner.contact').factory('businessPartnerContactExtRoleUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerContactExtRoleLayout', 'businesspartnerContactTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businessPartnerContactExtRoleLayout, businesspartnerContactTranslationService, platformSchemaService) {
				let BaseService = platformUIStandardConfigService;
				let domains = platformSchemaService.getSchemaFromCache({typeName: 'Contact2ExtRoleDto', moduleSubModule: 'BusinessPartner.Contact'}).properties;
				return new BaseService(businessPartnerContactExtRoleLayout, domains, businesspartnerContactTranslationService);
			}
		]);
})(angular);
