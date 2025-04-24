/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationDataTree2ModelConfigurationService',
		modelAdministrationDataTree2ModelConfigurationService);

	modelAdministrationDataTree2ModelConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function modelAdministrationDataTree2ModelConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'DataTree2ModelDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.ProjectFk = {domain: 'integer'};
		}

		const layout = modelAdministrationUIConfigurationService.getDataTree2ModelLayout();
		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);
