/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.change').service('modelChangeConfigurationService', ModelChangeConfigurationService);

	ModelChangeConfigurationService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'modelChangeUIConfigurationService', 'modelChangeTranslationService'];

	function ModelChangeConfigurationService(platformUIStandardConfigService, platformSchemaService,
		modelChangeUIConfigurationService, modelChangeTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let modelChangeDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ChangeDto',
			moduleSubModule: 'Model.Change'
		});
		if (modelChangeDomainSchema) {
			modelChangeDomainSchema = modelChangeDomainSchema.properties;
			modelChangeDomainSchema.Value = {domain: 'dynamic'};
			modelChangeDomainSchema.ValueCmp = {domain: 'dynamic'};
		}

		const modelChangeDetailLayout = modelChangeUIConfigurationService.getModelChangeLayout();
		return new BaseService(modelChangeDetailLayout, modelChangeDomainSchema, modelChangeTranslationService);
	}
})(angular);
