/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationModelImportPropertyKeyRuleConfigurationService',
		ModelAdministrationModelImportPropertyKeyRuleConfigurationService);

	ModelAdministrationModelImportPropertyKeyRuleConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationModelImportUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationModelImportPropertyKeyRuleConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationModelImportUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationViewerSettingsSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelImportPropertyKeyRuleDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationViewerSettingsSchema) {
			modelAdministrationViewerSettingsSchema = modelAdministrationViewerSettingsSchema.properties;
		}

		const layout = modelAdministrationModelImportUIConfigurationService.getPropertyKeyRuleContainerLayout();
		return new BaseService(layout, modelAdministrationViewerSettingsSchema, modelAdministrationTranslationService);
	}
})(angular);
