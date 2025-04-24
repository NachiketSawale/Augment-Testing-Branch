/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.evaluation').service('modelEvaluationRulesetGroupConfigurationService',
		ModelEvaluationRulesetGroupConfigurationService);

	ModelEvaluationRulesetGroupConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelEvaluationUIConfigurationService',
		'modelEvaluationTranslationService'];

	function ModelEvaluationRulesetGroupConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelEvaluationUIConfigurationService,
		modelEvaluationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelRulesetGroupDto',
			moduleSubModule: 'Model.Evaluation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.ScopeLevel = {domain: 'text'};
		}

		const layout = modelEvaluationUIConfigurationService.getRulesetGroupLayout();
		return new BaseService(layout, domainSchema, modelEvaluationTranslationService);
	}
})(angular);
