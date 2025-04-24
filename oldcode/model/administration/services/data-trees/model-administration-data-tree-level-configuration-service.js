/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationDataTreeLevelConfigurationService',
		ModelAdministrationDataTreeLevelConfigurationService);

	ModelAdministrationDataTreeLevelConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationDataTreeLevelConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'DataTreeLevelDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAdministrationUIConfigurationService.getDataTreeLevelLayout();
		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);
