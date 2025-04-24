/**
 * Created by wed on 8/25/2017.
 */

(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerGuarantorUIStandardService', ['platformSchemaService', 'platformUIStandardConfigService', 'businessPartnerGuarantorLayout', 'businesspartnerMainTranslationService', 'platformUIStandardExtentService', function (platformSchemaService, PlatformUIStandardConfigService, businessPartnerGuarantorLayout, businesspartnerMainTranslationService, platformUIStandardExtentService) {
		var domainSchema = platformSchemaService.getSchemaFromCache(
			{typeName: 'GuarantorDto', moduleSubModule: 'BusinessPartner.Main'}
		);
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		var service = new PlatformUIStandardConfigService(businessPartnerGuarantorLayout, domainSchema, businesspartnerMainTranslationService);

		platformUIStandardExtentService.extend(service, businessPartnerGuarantorLayout.addition, domainSchema);

		return service;
	}]);

})(angular);
