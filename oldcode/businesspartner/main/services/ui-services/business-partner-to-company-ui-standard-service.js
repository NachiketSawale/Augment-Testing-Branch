/**
 * Created by chi on 4/17/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainBusinessPartner2CompanyUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.main').factory('businessPartnerMainBusinessPartner2CompanyUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerMainBusinessPartner2CompanyLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			/* jshint -W072 */
			function (platformUIStandardConfigService, businessPartnerMainBusinessPartner2CompanyLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'BusinessPartner2CompanyDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				var service = new BaseService(businessPartnerMainBusinessPartner2CompanyLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businessPartnerMainBusinessPartner2CompanyLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businessPartnerMainBusinessPartner2CompanyLayout.addition, domains);

				return service;
			}
		]);
})(angular);
