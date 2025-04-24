/**
 * Created by chi on 4/16/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainRealestateUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.main').factory('businessPartnerMainRealestateUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainRealestateLayout', 'businesspartnerMainTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businesspartnerMainRealestateLayout, businesspartnerMainTranslationService, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'RealEstateDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				return new BaseService(businesspartnerMainRealestateLayout, domains, businesspartnerMainTranslationService);
			}
		]);
})(angular);
