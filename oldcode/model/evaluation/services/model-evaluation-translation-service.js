/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const modelEvaluationModule = 'model.evaluation';
	const basicsCommonModule = 'basics.common';
	const basicsConfigModule = 'basics.config';
	const cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name modelEvaluationTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelEvaluationModule).service('modelEvaluationTranslationService', ModelEvaluationTranslationService);

	ModelEvaluationTranslationService.$inject = ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules'];

	function ModelEvaluationTranslationService(platformTranslationUtilitiesService,
		modelViewerTranslationModules) {

		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				modelEvaluationModule,
				basicsCommonModule,
				basicsConfigModule,
				cloudCommonModule].concat(modelViewerTranslationModules)
		};

		data.words = {
			Ruleset: {location: modelEvaluationModule, identifier: 'ruleset', initial: 'Rule Set'},
			ScopeLevel: {location: basicsCommonModule, identifier: 'configLocation.label', initial: 'Location'},
			HighlightingSchemeFk: { location: modelEvaluationModule, identifier: 'hlscheme', initial: 'Highlighting Scheme' },
			ModuleFk: {location: modelEvaluationModule, identifier: 'module', initial: 'Module'},
			Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
			ModeId: {location: modelEvaluationModule, identifier: 'expressionType', initial: 'Rule Type'},
			HlItemFk: {location: modelEvaluationModule, identifier: 'hlItem', initial: 'Highlighting Item'},
			ModelRulesetGroupFk: {location: modelEvaluationModule, identifier: 'group', initial: 'Group'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
			IsDisabled: {location: modelEvaluationModule, identifier: 'disabled', initial: 'Disabled'},
			Origin: {location: modelEvaluationModule, identifier: 'origin', initial: 'Origin'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
