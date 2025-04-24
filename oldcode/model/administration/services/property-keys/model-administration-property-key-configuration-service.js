/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationPropertyKeyConfigurationService',
		ModelAdministrationPropertyKeyConfigurationService);

	ModelAdministrationPropertyKeyConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationPropertyKeyUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationPropertyKeyConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationPropertyKeyUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PropertyKeyDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.DefaultValue = {domain: 'dynamic'};
		}

		const layout = modelAdministrationPropertyKeyUIConfigurationService.getPropertyKeyLayout();
		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);
