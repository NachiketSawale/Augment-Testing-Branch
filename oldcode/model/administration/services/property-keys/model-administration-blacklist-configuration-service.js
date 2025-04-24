/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationBlackListConfigurationService',
		ModelAdministrationBlackListConfigurationService);

	ModelAdministrationBlackListConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelAdministrationBlackListUIConfigurationService',
		'modelAdministrationTranslationService'];

	function ModelAdministrationBlackListConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelAdministrationBlackListUIConfigurationService,
		modelAdministrationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelAdministrationBlackListDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelComparePropertykeyBlackListDto',
			moduleSubModule: 'Model.Administration'
		});
		if (modelAdministrationBlackListDomainSchema) {
			modelAdministrationBlackListDomainSchema = modelAdministrationBlackListDomainSchema.properties;
		}

		const layout = modelAdministrationBlackListUIConfigurationService.getBlackListLayout();
		return new BaseService(layout, modelAdministrationBlackListDomainSchema, modelAdministrationTranslationService);
	}
})(angular);
