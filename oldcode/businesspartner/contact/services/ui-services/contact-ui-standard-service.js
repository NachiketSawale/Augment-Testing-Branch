/**
 * Created by chi on 4/17/2015.
 */
(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name businessPartnerContactUIStandardService
	 * @function
	 * @description
	 *
	 * UI standard service for 'contact' grid / form container.
	 */
	angular.module(moduleName).factory('businessPartnerContactUIStandardService', [
		'platformUIStandardConfigService', 'businessPartnerContactLayout', 'businesspartnerContactTranslationService',
		'platformSchemaService', 'platformUIStandardExtentService', 'businessPartnerHelper',
		function (platformUIStandardConfigService, businessPartnerContactLayout, businesspartnerContactTranslationService,
			platformSchemaService, platformUIStandardExtentService, businessPartnerHelper) {

			let BaseService = platformUIStandardConfigService;

			let domains = platformSchemaService.getSchemaFromCache({
				typeName: 'ContactDto',
				moduleSubModule: 'BusinessPartner.Contact'
			}).properties;

			let service = new BaseService(businessPartnerContactLayout, domains, businesspartnerContactTranslationService);

			businessPartnerHelper.extendGrouping(businessPartnerContactLayout.addition.grid);

			platformUIStandardExtentService.extend(service, businessPartnerContactLayout.addition, domains);

			return service;
		}
	]);
})(angular);
