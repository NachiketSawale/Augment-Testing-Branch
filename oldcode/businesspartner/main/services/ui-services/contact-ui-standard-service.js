/**
 * Created by chi on 4/17/2015.
 */
(function () {
	'use strict';
	var module = 'businesspartner.main';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainContactUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(module).factory('businessPartnerMainContactUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerMainContactLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			/* jshint -W072 */
			function (platformUIStandardConfigService, businessPartnerMainContactLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'}).properties;
				var service = new BaseService(businessPartnerMainContactLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businessPartnerMainContactLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businessPartnerMainContactLayout.addition, domains);

				return service;
			}
		]);
})(angular);
