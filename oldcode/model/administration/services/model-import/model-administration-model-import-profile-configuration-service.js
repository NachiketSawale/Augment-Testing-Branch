/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationModelImportProfileConfigurationService',
		ModelAdministrationModelImportProfileConfigurationService);

	ModelAdministrationModelImportProfileConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationModelImportUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationModelImportProfileConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationModelImportUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationViewerSettingsSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelImportProfileDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationViewerSettingsSchema) {
			modelAdministrationViewerSettingsSchema = modelAdministrationViewerSettingsSchema.properties;
		}

		const layout = modelAdministrationModelImportUIConfigurationService.getImportProfileContainerLayout();
		return new BaseService(layout, modelAdministrationViewerSettingsSchema, modelAdministrationTranslationService);
	}
})(angular);
