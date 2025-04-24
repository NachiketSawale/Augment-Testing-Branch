/**
 * Created by chi on 4/16/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainBankUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').factory('businessPartnerMainBankUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainBankLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			function (platformUIStandardConfigService, businesspartnerMainBankLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'BankDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				var service = new BaseService(businesspartnerMainBankLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businesspartnerMainBankLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businesspartnerMainBankLayout.addition, domains);
				return service;
			}
		]);
})(angular);
