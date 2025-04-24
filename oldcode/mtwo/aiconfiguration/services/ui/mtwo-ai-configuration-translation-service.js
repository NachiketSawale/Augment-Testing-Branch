/*
 * $Id: mtwo-aiconfiguration-translation-service.js 627575 2021-03-15 06:14:44Z chd $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let mtwoAIConfigurationModule = 'mtwo.aiconfiguration';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';
	let modelMainModule = 'model.main';

	/**
	 * @ngdoc service
	 * @name mtwoAIConfigurationTranslationService
	 * @description Provides translations for the module.
	 */
	angular.module(mtwoAIConfigurationModule).service('mtwoAIConfigurationTranslationService', MtwoAIConfigurationTranslationService);

	MtwoAIConfigurationTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function MtwoAIConfigurationTranslationService(platformTranslationUtilitiesService) {
		let self = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [mtwoAIConfigurationModule, basicsCommonModule, cloudCommonModule, modelMainModule]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			Id: {location: cloudCommonModule, identifier: 'entityId', initial: 'Id'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
			Name: {location: cloudCommonModule, identifier: 'entityName', initial: 'Name'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
			IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Is Live'},
			ModelType: {location: mtwoAIConfigurationModule, identifier: 'modelType', initial: 'Model Type'},
			ValueType: {location: modelMainModule, identifier: 'propertyValueType', initial: 'Value Type'},
			Guid: {location: mtwoAIConfigurationModule, identifier: 'guid', initial: 'GUID'},
			Alias: {location: mtwoAIConfigurationModule, identifier: 'alias', initial: 'Alias'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);
