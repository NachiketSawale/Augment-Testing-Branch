
(function (angular) {
	'use strict';

	let controllingProjectControlsModule = 'controlling.projectcontrols';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';
	let controllingStrucutreModule = 'controlling.structure'
	angular.module(controllingProjectControlsModule).service('controllingProjectControlsTranslationService', ControllingProjectControlsTranslationService);

	ControllingProjectControlsTranslationService.$inject = ['_', 'platformTranslationUtilitiesService', 'controllingProjectControlsConfigService'];

	function ControllingProjectControlsTranslationService(_, platformTranslationUtilitiesService, controllingProjectControlsConfigService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [controllingProjectControlsModule, basicsCommonModule, cloudCommonModule, controllingStrucutreModule]
		};

		data.words = {
			Code: { location: controllingProjectControlsModule, identifier: 'code', initial: 'Code' },
			BisPaBoqFk: {location: controllingProjectControlsModule, identifier: 'bisPaBoqFk', initial: 'BoQ Item'},
			BisPaActivityFk: {location: controllingProjectControlsModule, identifier: 'bisPaActivityFk', initial: 'Activity Item'},
			Period: {location: controllingProjectControlsModule, identifier: 'period', initial: 'Report Period'},
			Value: {location: controllingProjectControlsModule, identifier: 'period', initial: 'Value'}
		};

		let columns = controllingProjectControlsConfigService.getColumns();

		if(columns){
			_.forEach(columns, function(column){
				data.words[column.name] = {
					location: controllingProjectControlsModule, identifier: column.name, initial: column.description ? column.description : column.Code
				};
			});
		}

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
