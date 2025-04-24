/**
 * Created by chi on 4/20/2015.
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
	angular.module('businesspartner.main').factory('businessPartnerMainActivityUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainActivityLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
			/* jshint -W072 */
			function (platformUIStandardConfigService, businesspartnerMainActivityLayout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'ActivityDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				var service = new BaseService(businesspartnerMainActivityLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businesspartnerMainActivityLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businesspartnerMainActivityLayout.addition, domains);
				return service;
			}
		]);
})(angular);
