/**
 * Created by zos on 8/6/2015.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainProcurementStructureUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainPrcStructureUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainProcurementStructureLayout', 'businesspartnerMainTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, layout, businesspartnerMainTranslationService, platformSchemaService, platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'BusinessPartner2PrcStructureDto', moduleSubModule: 'BusinessPartner.Main'}).properties;
				var service = new BaseService(layout, domains, businesspartnerMainTranslationService);

				platformUIStandardExtentService.extend(service, layout.addition, domains);
				return service;
			}
		]);
})(angular);