(function (angular) {
	'use strict';
	angular.module('businesspartner.main').factory('businessPartnerMainExtRoleUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerMainExtRoleLayout', 'businesspartnerMainTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businessPartnerMainExtRoleLayout, businesspartnerMainTranslationService, platformSchemaService) {
				let BaseService = platformUIStandardConfigService;
				let domains = platformSchemaService.getSchemaFromCache({typeName: 'BusinessPartner2ExtRoleDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				return new BaseService(businessPartnerMainExtRoleLayout, domains, businesspartnerMainTranslationService);
			}
		]);
})(angular);
