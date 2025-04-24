
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerContact2CompanyUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.contact').factory('businessPartnerContact2CompanyUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerContact2CompanyLayout', 'businesspartnerContactTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			/* jshint -W072 */
			function (platformUIStandardConfigService, businessPartnerContact2CompanyLayout, businesspartnerContactTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				let BaseService = platformUIStandardConfigService;
				let domains = platformSchemaService.getSchemaFromCache({typeName: 'Contact2BasCompanyDto', moduleSubModule: 'BusinessPartner.Contact'}).properties;
				let service = new BaseService(businessPartnerContact2CompanyLayout, domains, businesspartnerContactTranslationService);
				businessPartnerHelper.extendGrouping(businessPartnerContact2CompanyLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businessPartnerContact2CompanyLayout.addition, domains);

				return service;
			}
		]);
})(angular);
