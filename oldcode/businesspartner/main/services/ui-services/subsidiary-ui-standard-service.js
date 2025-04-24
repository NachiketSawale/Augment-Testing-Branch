/**
 * Created by chi on 4/21/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainActivityUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').factory('businessPartnerMainSubsidiaryUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerMainSubsidiaryLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			function (platformUIStandardConfigService, businessPartnerMainSubsidiaryLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				var service = new BaseService(businessPartnerMainSubsidiaryLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businessPartnerMainSubsidiaryLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businessPartnerMainSubsidiaryLayout.addition, domains);

				return service;
			}
		]);
})(angular);
