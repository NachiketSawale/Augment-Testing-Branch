/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationPropertyKeyTagCategoryConfigurationService',
		ModelAdministrationPropertyKeyTagCategoryConfigurationService);

	ModelAdministrationPropertyKeyTagCategoryConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationPropertyKeyUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationPropertyKeyTagCategoryConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationPropertyKeyUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PropertyKeyTagCategoryDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAdministrationPropertyKeyUIConfigurationService.getPropertyKeyTagCategoryLayout();
		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);
