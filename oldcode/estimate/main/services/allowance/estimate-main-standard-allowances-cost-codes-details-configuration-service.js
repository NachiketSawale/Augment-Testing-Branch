
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estStandardAllowancesCostCodeDetailConfigurationService',[
		'platformUIStandardConfigService',
		'platformSchemaService',
		'estimateMainTranslationService',
		'estimateMainUIConfigurationService',
		'platformUIStandardExtentService',
		function (platformUIStandardConfigService,
			platformSchemaService,
			estimateMainTranslationService,
			estimateMainUIConfigurationService,
			platformUIStandardExtentService) {
			let BaseService = platformUIStandardConfigService;
			let domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EstAllMarkup2costcodeDto',
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

			let service = new BaseService(estimateMainUIConfigurationService.getStandardAllowancesCostCodeDetailLayout(), domainSchema, estimateMainTranslationService);
			platformUIStandardExtentService.extend(service,estimateMainUIConfigurationService.getStandardAllowancesCostCodeDetailLayout().addition,domainSchema);
			return service;
		}
	]);
})(angular);