/**
 * Created by chi on 4/20/2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainAgreementUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainAgreementUIStandardService', businesspartnerMainAgreementUIStandardService);

	businesspartnerMainAgreementUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'businesspartnerMainAgreementLayout', 'businesspartnerMainTranslationService'];

	/* jshint -W072 */
	function businesspartnerMainAgreementUIStandardService(platformUIStandardConfigService, platformSchemaService,
		businesspartnerMainAgreementLayout, businesspartnerMainTranslationService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({
			typeName: 'AgreementDto',
			moduleSubModule: 'BusinessPartner.Main'
		}).properties;
		return new BaseService(businesspartnerMainAgreementLayout, domains, businesspartnerMainTranslationService);
	}
})(angular);