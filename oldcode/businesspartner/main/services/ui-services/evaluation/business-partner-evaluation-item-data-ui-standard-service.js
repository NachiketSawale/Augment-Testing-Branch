(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businessPartnerEvaluationItemDataUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('businessPartnerEvaluationItemDataUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerEvaluationItemDataDetailLayout', 'businessPartnerEvaluationTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businessPartnerEvaluationItemDataDetailLayout, businesspartnerMainTranslationService, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				let attributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'EvaluationItemDataDto', moduleSubModule: 'BusinessPartner.Main'});

				attributeDomains = attributeDomains.properties;

				return new StructureUIStandardService(businessPartnerEvaluationItemDataDetailLayout, attributeDomains, businesspartnerMainTranslationService);
			}
		]);

})(angular);
