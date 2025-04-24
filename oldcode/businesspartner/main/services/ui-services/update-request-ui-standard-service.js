/**
 * Created by luy on 6/20/2019.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name businessPartnerMainUpdateRequestUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').factory('businessPartnerMainUpdateRequestUIStandardService',
		['platformUIStandardConfigService', 'businesspartnerMainUpdateRequestLayout', 'businesspartnerMainTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businesspartnerMainUpdateRequestLayout, businesspartnerMainTranslationService, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({typeName: 'UpdaterequestDto', moduleSubModule: 'BusinessPartner.Main'}).properties;

				return new BaseService(businesspartnerMainUpdateRequestLayout, domains, businesspartnerMainTranslationService);
			}
		]);
})(angular);
