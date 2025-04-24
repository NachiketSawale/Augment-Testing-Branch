/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationViewerSettingsConfigurationService',
		ModelAdministrationViewerSettingsConfigurationService);

	ModelAdministrationViewerSettingsConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationViewerSettingsConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationViewerSettingsSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ViewerSettingsDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationViewerSettingsSchema) {
			modelAdministrationViewerSettingsSchema = modelAdministrationViewerSettingsSchema.properties;
		}

		const layout = modelAdministrationUIConfigurationService.getViewerSettingsContainerLayout();
		return new BaseService(layout, modelAdministrationViewerSettingsSchema, modelAdministrationTranslationService);
	}
})(angular);
