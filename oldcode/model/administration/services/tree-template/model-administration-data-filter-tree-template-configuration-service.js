/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationDataFilterTreeTemplateConfigurationService',
		ModelAdministrationDataFilterTreeTemplateConfigurationService);

	ModelAdministrationDataFilterTreeTemplateConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationDataFilterTreeTemplateConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelFilterTreeTemplateDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAdministrationUIConfigurationService.getDataTreeTemplateLayout();
		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);
