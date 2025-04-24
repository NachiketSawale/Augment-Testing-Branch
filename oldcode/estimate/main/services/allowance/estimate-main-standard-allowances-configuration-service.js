
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainStandardAllowancesConfigurationService',[
		'platformUIStandardConfigService',
		'platformSchemaService',
		'estimateMainTranslationService',
		'estimateMainUIConfigurationService',
		function (platformUIStandardConfigService,
			platformSchemaService,
			estimateMainTranslationService,
			estimateMainUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EstAllowanceDto',
				moduleSubModule: 'Estimate.Main'
			});

			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			return new BaseService(estimateMainUIConfigurationService.getStandardAllowancesDetailLayout(), domainSchema, estimateMainTranslationService);
		}
	]);
})(angular);