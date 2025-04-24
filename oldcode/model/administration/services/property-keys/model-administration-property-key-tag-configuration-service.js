/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationPropertyKeyTagConfigurationService',
		ModelAdministrationPropertyKeyTagConfigurationService);

	ModelAdministrationPropertyKeyTagConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationPropertyKeyUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationPropertyKeyTagConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationPropertyKeyUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PropertyKeyTagDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAdministrationPropertyKeyUIConfigurationService.getPropertyKeyTagLayout();
		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);
