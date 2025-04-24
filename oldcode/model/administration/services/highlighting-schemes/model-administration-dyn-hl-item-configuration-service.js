/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationDynHlItemConfigurationService',
		ModelAdministrationDynHlItemConfigurationService);

	ModelAdministrationDynHlItemConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationDynHlItemConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationDynHlItemDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'HighlightingItemDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationDynHlItemDomainSchema) {
			modelAdministrationDynHlItemDomainSchema = modelAdministrationDynHlItemDomainSchema.properties;
		}

		const layout = modelAdministrationUIConfigurationService.getDynamicHighlightingItemLayout();
		return new BaseService(layout, modelAdministrationDynHlItemDomainSchema, modelAdministrationTranslationService);
	}
})(angular);
