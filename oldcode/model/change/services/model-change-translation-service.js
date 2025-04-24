/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const modelChangeModule = 'model.change';
	const cloudCommonModule = 'cloud.common';
	const modelChangeSetModule = 'model.changeset';
	const modelMainModule = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelChangeTranslationService
	 * @description provides translation for project main module
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelChangeModule).service('modelChangeTranslationService', ModelChangeTranslationService);

	ModelChangeTranslationService.$inject = ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules'];

	function ModelChangeTranslationService(platformTranslationUtilitiesService,
		modelViewerTranslationModules) {

		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				modelChangeModule,
				cloudCommonModule,
				modelChangeSetModule
			].concat(modelViewerTranslationModules)
		};

		data.words = {
			ChangeTypeFk: {location: modelChangeModule, identifier: 'changeType', initial: 'Change Type'},
			ModelFk: {location: modelChangeSetModule, identifier: 'model1', initial: 'Model 1'},
			ModelCmpFk: {location: modelChangeSetModule, identifier: 'model2', initial: 'Model 2'},
			ObjectFk: {location: modelChangeModule, identifier: 'object1', initial: 'Object in Model 1'},
			CpiId: {location: modelChangeModule, identifier: 'cpiid', initial: 'CpiId - Object in Model 1'},
			ObjectCmpFk: {location: modelChangeModule, identifier: 'object2', initial: 'Object in Model 2'},
			CmpCpiId: {location: modelChangeModule, identifier: 'cmpcpiid', initial: 'CpiId - Object in Model 2'},
			PropertyKeyFk: {location: modelMainModule, identifier: 'entityPropertyKey', initial: 'Property Key'},
			Value: {location: modelChangeModule, identifier: 'value1', initial: 'Property Value in Model 1'},
			ValueCmp: {location: modelChangeModule, identifier: 'value2', initial: 'Property Value in Model 2'},
			IsChangeOrder: {location: modelChangeModule, identifier: 'changeOrder', initial: 'Is Change Order'},
			LocationFk: {location: modelChangeModule, identifier: 'location'}
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
