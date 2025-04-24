
(function (angular) {
	/* global */
	'use strict';

	let controllingConfigurationModule = 'controlling.configuration';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';

	angular.module(controllingConfigurationModule).service('controllingConfigurationTranslationService', ControllingConfigurationTranslationService);

	ControllingConfigurationTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ControllingConfigurationTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [controllingConfigurationModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			Code: {location: controllingConfigurationModule, identifier: 'Code', initial: 'Code'},
			Description: {location: controllingConfigurationModule, identifier: 'Description', initial: 'Description'},
			DescriptionInfo: {location: controllingConfigurationModule, identifier: 'Description', initial: 'Description'},
			BasContrColumnTypeFk: {location: controllingConfigurationModule, identifier: 'BasContrColumnTypeFk', initial: 'Type'},
			Formula: {location: controllingConfigurationModule, identifier: 'Formula', initial: 'Formula'},
			IsDefault: {location: controllingConfigurationModule, identifier: 'IsDefault', initial: 'Is Default'},
			IsVisible: {location: controllingConfigurationModule, identifier: 'isVisible', initial: 'Visible in Project Controls'},
			IsEditable: {location: controllingConfigurationModule, identifier: 'IsEditable', initial: 'Is Editable'},
			BasChartTypeFk: {location: controllingConfigurationModule, identifier: 'BasChartTypeFk', initial: 'Chart Type'},
			// ChartType: {location: controllingConfigurationModule, identifier: 'ChartType', initial: 'Chart Type'},
			IsDefault1: {location: controllingConfigurationModule, identifier: 'isDefault1', initial: 'Is Default for Chart1'},
			IsDefault2: {location: controllingConfigurationModule, identifier: 'isDefault2', initial: 'Is Default for Chart2'},
			Action:{location: controllingConfigurationModule, identifier: 'action', initial: 'Check Config'},
			Aggregates:{location: controllingConfigurationModule, identifier: 'Aggregates', initial: 'Aggregates'}
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
