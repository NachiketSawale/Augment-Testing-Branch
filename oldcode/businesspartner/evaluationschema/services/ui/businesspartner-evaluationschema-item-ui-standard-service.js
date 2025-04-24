(function () {
	'use strict';
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationSchemaItemUIStandardService', ['platformUIStandardConfigService', 'businessPartnerEvaluationSchemaTranslationServiceNew', 'businessPartnerEvaluationSchemaItemLayoutService', 'platformSchemaService',
		function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EvaluationItemDto',
				moduleSubModule: 'BusinessPartner.EvaluationSchema'
			});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}
			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;
			return new BaseService(layout, domainSchema, translationService);
		}
	]);
})();