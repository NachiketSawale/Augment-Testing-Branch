(function() {
	'use strict';

	const moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('productionplanningProcessConfigurationProcessTemplateLayout', ProcessTemplateLayout);

	ProcessTemplateLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function ProcessTemplateLayout(basicsLookupdataConfigGenerator) {
		return {
			fid: 'productionplanning.processconfiguration.processtemplate',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'processtypefk', 'isdefault', 'islive']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				processtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsprocesstype', null, { customBoolProperty: 'ISPLACEHOLDER'})
			}
		};
	}

	angular.module(moduleName).factory('productionplanningProcessConfigurationProcessTemplateUIStandardService', ProcessTemplateUIStandardService);

	ProcessTemplateUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'productionplanningProcessConfigurationTranslationService',
		'productionplanningProcessConfigurationProcessTemplateLayout'];

	function ProcessTemplateUIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, processTemplateLayout) {
		let BaseService = platformUIStandardConfigService;

		let processTemplateAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'ProcessTemplateDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration'
		});

		let schemaProperties = processTemplateAttributeDomains.properties;

		let service = new BaseService(processTemplateLayout, schemaProperties, translationService);

		return service;
	}
})();