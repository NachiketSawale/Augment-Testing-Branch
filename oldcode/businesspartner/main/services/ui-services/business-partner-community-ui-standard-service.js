/**
 * Created by chi on 7/12/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainCommunityUIStandardService', businessPartnerMainCommunityUIStandardService);

	businessPartnerMainCommunityUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'businessPartnerMainCommunityLayout',
		'businesspartnerMainTranslationService'
	];

	function businessPartnerMainCommunityUIStandardService(platformUIStandardConfigService,
		platformSchemaService,
		businessPartnerMainCommunityLayout,
		businesspartnerMainTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({typeName: 'CommunityDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
		return new BaseService(businessPartnerMainCommunityLayout, domains, businesspartnerMainTranslationService);
	}
})(angular);