/**
 * Created by zpa on 2016/10/10.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerCustomerCompanyUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerCustomerCompanyLayout', 'businesspartnerMainTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businessPartnerCustomerCompanyLayout, businesspartnerMainTranslationService, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CustomerCompanyDto',
					moduleSubModule: 'BusinessPartner.Main'
				});

				attributeDomains = attributeDomains.properties;

				return new StructureUIStandardService(businessPartnerCustomerCompanyLayout, attributeDomains, businesspartnerMainTranslationService);
			}
		]);
})(angular);