/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationDataTreeConfigurationService',
		ModelAdministrationDataTreeConfigurationService);

	ModelAdministrationDataTreeConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationDataTreeConfigurationService(platformUIStandardConfigService, platformSchemaService, modelAdministrationUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'DataTreeDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelAdministrationUIConfigurationService.getDataTreeLayout();
		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);
