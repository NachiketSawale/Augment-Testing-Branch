/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.evaluation').service('modelEvaluationRulesetConfigurationService',
		ModelEvaluationRulesetConfigurationService);

	ModelEvaluationRulesetConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelEvaluationUIConfigurationService',
		'modelEvaluationTranslationService'];

	function ModelEvaluationRulesetConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelEvaluationUIConfigurationService,
		modelEvaluationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelRulesetDto',
			moduleSubModule: 'Model.Evaluation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.ScopeLevel = {domain: 'text'};
			domainSchema.Origin = {domain: 'text'};
		}

		const layout = modelEvaluationUIConfigurationService.getRulesetLayout();
		return new BaseService(layout, domainSchema, modelEvaluationTranslationService);
	}
})(angular);
