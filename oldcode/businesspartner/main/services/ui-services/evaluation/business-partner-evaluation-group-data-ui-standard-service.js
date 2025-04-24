(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businessPartnerEvaluationGroupDataUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('businessPartnerEvaluationGroupDataUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerEvaluationGroupDataDetailLayout', 'businesspartnerMainTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businessPartnerEvaluationGroupDataDetailLayout, businesspartnerMainTranslationService, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				let attributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'EvaluationGroupDataDto', moduleSubModule: 'BusinessPartner.Main'});

				attributeDomains = attributeDomains.properties;

				return new StructureUIStandardService(businessPartnerEvaluationGroupDataDetailLayout, attributeDomains, businesspartnerMainTranslationService);
			}
		]);

})(angular);
