/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationStaticHlSchemeConfigurationService',
		ModelAdministrationStaticHlSchemeConfigurationService);

	ModelAdministrationStaticHlSchemeConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationStaticHlSchemeConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationStaticHlSchemeDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'HighlightingSchemeDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationStaticHlSchemeDomainSchema) {
			modelAdministrationStaticHlSchemeDomainSchema = modelAdministrationStaticHlSchemeDomainSchema.properties;
			modelAdministrationStaticHlSchemeDomainSchema.ScopeLevel = {domain: 'text'};
		}

		const layout = modelAdministrationUIConfigurationService.getStaticHighlightingSchemeLayout();
		return new BaseService(layout, modelAdministrationStaticHlSchemeDomainSchema, modelAdministrationTranslationService);
	}
})(angular);
