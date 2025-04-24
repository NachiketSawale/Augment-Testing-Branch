/**
 * Created by ada on 2017/8/17.
 */
(function () {
	'use strict';
	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businessPartnerEvaluationDocumentDataUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('businessPartnerEvaluationDocumentDataUIStandardService',
		['platformUIStandardConfigService', 'businessPartnerEvaluationDocumentDataDetailLayout', 'businessPartnerEvaluationTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, businessPartnerEvaluationDocumentDataDetailLayout, businesspartnerMainTranslationService, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'EvaluationDocumentDto', moduleSubModule: 'BusinessPartner.Main'});

				attributeDomains = attributeDomains.properties;

				return new StructureUIStandardService(businessPartnerEvaluationDocumentDataDetailLayout, attributeDomains, businesspartnerMainTranslationService);
			}
		]);

})(angular);
