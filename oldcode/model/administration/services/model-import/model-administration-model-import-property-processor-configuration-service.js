/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationModelImportPropertyProcessorConfigurationService',
		ModelAdministrationModelImportPropertyProcessorConfigurationService);

	ModelAdministrationModelImportPropertyProcessorConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationModelImportUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationModelImportPropertyProcessorConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationModelImportUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let schema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelImportPropertyProcessorDto',
			moduleSubModule: 'Model.Administration'
		});
		if (schema) {
			schema = schema.properties;
		}

		const layout = modelAdministrationModelImportUIConfigurationService.getPropertyProcessorContainerLayout();
		return new BaseService(layout, schema, modelAdministrationTranslationService);
	}
})(angular);
