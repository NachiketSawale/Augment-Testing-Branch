/**
 * Created by xai on 5/7/2018.
 */
(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartner2ExternalUIStandardService', ['platformSchemaService', 'platformUIStandardConfigService', 'businessPartnerMainBusinessPartner2ExternalLayout', 'businesspartnerMainTranslationService', 'platformUIStandardExtentService', function (platformSchemaService, PlatformUIStandardConfigService, businessPartnerMainBusinessPartner2ExternalLayout, businesspartnerMainTranslationService, platformUIStandardExtentService) {
		var domainSchema = platformSchemaService.getSchemaFromCache(
			{typeName: 'Bp2externalDto', moduleSubModule: 'BusinessPartner.Main'}
		);
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		var service = new PlatformUIStandardConfigService(businessPartnerMainBusinessPartner2ExternalLayout, domainSchema, businesspartnerMainTranslationService);

		platformUIStandardExtentService.extend(service, businessPartnerMainBusinessPartner2ExternalLayout.addition, domainSchema);

		return service;
	}]);

})(angular);