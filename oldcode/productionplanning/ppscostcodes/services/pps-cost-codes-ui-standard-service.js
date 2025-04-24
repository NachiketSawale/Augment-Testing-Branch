(angular => {
	'use strict';
	const moduleName = 'productionplanning.ppscostcodes';

	angular.module(moduleName).factory('ppsCostCodesUIStandardService', ppsCostCodesUIStandardService);

	ppsCostCodesUIStandardService.$inject = ['_',
		'platformUIStandardConfigService',
		'platformSchemaService',
		'platformUIStandardExtentService',
		'cloudCommonGridService',
		'ppsCostCodesUIConfigurationService',
		'ppsCostCodesTranslationService',
		'ppsCostCodesConstantValues'];

	function ppsCostCodesUIStandardService(_,
		platformUIStandardConfigService,
		platformSchemaService,
		platformUIStandardExtentService,
		cloudCommonGridService,
		ppsCostCodesUIConfigurationService,
		ppsCostCodesTranslationService,
		ppsCostCodesConstantValues) {

		const BaseService = platformUIStandardConfigService;
		const layout = ppsCostCodesUIConfigurationService.getDetailLayout();
		const mdcCostCodesDomainSchema =  platformSchemaService.getSchemaFromCache(ppsCostCodesConstantValues.schemes.mdcCostCode);
		const ppsCostCodeDomainSchema = platformSchemaService.getSchemaFromCache(ppsCostCodesConstantValues.schemes.ppsCostCode);

		const ppsCostCodesProperties = cloudCommonGridService.addPrefixToKeys(ppsCostCodeDomainSchema.properties, ppsCostCodesConstantValues.prefix);
		const extendedPpsCostCodesProperties = angular.extend({}, ppsCostCodesProperties, mdcCostCodesDomainSchema.properties);

		function CostCodeUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		CostCodeUIStandardService.prototype = Object.create(BaseService.prototype);
		CostCodeUIStandardService.prototype.constructor = CostCodeUIStandardService;

		return new BaseService(layout, extendedPpsCostCodesProperties, ppsCostCodesTranslationService);
	}
})(angular);