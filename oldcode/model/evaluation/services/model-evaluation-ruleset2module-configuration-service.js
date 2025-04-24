/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.evaluation').service('modelEvaluationRuleset2ModuleConfigurationService',
		ModelEvaluationRuleset2ModuleConfigurationService);

	ModelEvaluationRuleset2ModuleConfigurationService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'modelEvaluationUIConfigurationService',
		'modelEvaluationTranslationService'];

	function ModelEvaluationRuleset2ModuleConfigurationService(platformUIStandardConfigService, platformSchemaService, modelEvaluationUIConfigurationService,
		modelEvaluationTranslationService) {

		const BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelRuleset2ModuleDto',
			moduleSubModule: 'Model.Evaluation'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		const layout = modelEvaluationUIConfigurationService.getRuleset2ModuleLayout();
		return new BaseService(layout, domainSchema, modelEvaluationTranslationService);
	}
})(angular);
