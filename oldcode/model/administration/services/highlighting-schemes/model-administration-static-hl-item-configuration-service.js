/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationStaticHlItemConfigurationService',
		ModelAdministrationStaticHlItemConfigurationService);

	ModelAdministrationStaticHlItemConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationStaticHlItemConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationStaticHlItemDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'HighlightingItemDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationStaticHlItemDomainSchema) {
			modelAdministrationStaticHlItemDomainSchema = modelAdministrationStaticHlItemDomainSchema.properties;
		}

		const layout = modelAdministrationUIConfigurationService.getStaticHighlightingItemLayout();
		return new BaseService(layout, modelAdministrationStaticHlItemDomainSchema, modelAdministrationTranslationService);
	}
})(angular);
