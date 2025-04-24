(function (angular) {
	'use strict';
	angular.module('businesspartner.main').factory('businessPartnerMainRegionUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerMainRegionLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService','businessPartnerHelper',
			function (platformUIStandardConfigService, businessPartnerMainRegionLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService,businessPartnerHelper) {
				let BaseService = platformUIStandardConfigService;
				let domains = platformSchemaService.getSchemaFromCache({typeName: 'RegionDto', moduleSubModule: 'BusinessPartner.Main'}).properties;

				let service=new BaseService(businessPartnerMainRegionLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businessPartnerMainRegionLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businessPartnerMainRegionLayout.addition, domains);
				return service
			}
		]);
})(angular);
