/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.evaluation').service('modelEvaluationRuleConfigurationService',
		ModelEvaluationRuleConfigurationService);

	ModelEvaluationRuleConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService', 'modelEvaluationUIConfigurationService',
		'modelEvaluationTranslationService'];

	function ModelEvaluationRuleConfigurationService(platformUIStandardConfigService,
		platformSchemaService, modelEvaluationUIConfigurationService,
		modelEvaluationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelRuleDto',
			moduleSubModule: 'Model.Evaluation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.ModeId = {domain: 'description'};
			domainSchema.HlItemFk = {domain: 'integer'};
			domainSchema.Origin = {domain: 'text'};
		}

		const layout = modelEvaluationUIConfigurationService.getRuleLayout();
		return new BaseService(layout, domainSchema, modelEvaluationTranslationService);
	}
})(angular);
