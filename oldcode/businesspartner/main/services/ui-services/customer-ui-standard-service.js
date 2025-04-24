/**
 * Created by chi on 4/20/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainCustomerUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').factory('businessPartnerMainCustomerUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainCustomerLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			function (platformUIStandardConfigService, businesspartnerMainCustomerLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'CustomerDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				var service = new BaseService(businesspartnerMainCustomerLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businesspartnerMainCustomerLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businesspartnerMainCustomerLayout.addition, domains);

				return service;
			}
		]);
})(angular);
