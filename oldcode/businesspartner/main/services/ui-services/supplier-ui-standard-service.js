/**
 * Created by chi on 4/20/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainSupplierUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.main').factory('businessPartnerMainSupplierUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainSupplierLayout', 'businesspartnerMainTranslationService', 'platformSchemaService',
			'platformUIStandardExtentService', 'businessPartnerHelper',
			function (platformUIStandardConfigService, businesspartnerMainSupplierLayout, businesspartnerMainTranslationService, platformSchemaService,
				platformUIStandardExtentService, businessPartnerHelper) {

				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'SupplierDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				var service = new BaseService(businesspartnerMainSupplierLayout, domains, businesspartnerMainTranslationService);
				businessPartnerHelper.extendGrouping(businesspartnerMainSupplierLayout.addition.grid);
				platformUIStandardExtentService.extend(service, businesspartnerMainSupplierLayout.addition, domains);

				return service;
			}
		]);
})(angular);
