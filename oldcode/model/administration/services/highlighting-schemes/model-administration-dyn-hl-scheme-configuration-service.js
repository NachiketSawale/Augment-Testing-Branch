/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationDynHlSchemeConfigurationService',
		ModelAdministrationDynHlSchemeConfigurationService);

	ModelAdministrationDynHlSchemeConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationDynHlSchemeConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationDynHlSchemeDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'HighlightingSchemeDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationDynHlSchemeDomainSchema) {
			modelAdministrationDynHlSchemeDomainSchema = modelAdministrationDynHlSchemeDomainSchema.properties;
			modelAdministrationDynHlSchemeDomainSchema.ScopeLevel = {domain: 'text'};
		}

		const layout = modelAdministrationUIConfigurationService.getDynamicHighlightingSchemeLayout();
		return new BaseService(layout, modelAdministrationDynHlSchemeDomainSchema, modelAdministrationTranslationService);
	}
})(angular);
