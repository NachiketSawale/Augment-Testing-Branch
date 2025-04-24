/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const modelChangeSetModule = 'model.changeset';
	const cloudCommonModule = 'cloud.common';
	const modelChangeModule = 'model.change';
	const projectMainModule = 'project.main';
	const servicesSchedulerModule = 'services.schedulerui';

	/**
	 * @ngdoc service
	 * @name modelChangeSetTranslationService
	 * @description provides translation for project main module
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelChangeSetModule).service('modelChangeSetTranslationService', ModelChangeSetTranslationService);

	ModelChangeSetTranslationService.$inject = ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules'];

	function ModelChangeSetTranslationService(platformTranslationUtilitiesService,
		modelViewerTranslationModules) {

		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				modelChangeSetModule,
				cloudCommonModule,
				modelChangeModule,
				projectMainModule,
				servicesSchedulerModule
			].concat(modelViewerTranslationModules)
		};

		data.words = {
			ModelFk: { location: modelChangeSetModule, identifier: 'model1', initial: 'Model 1' },
			ModelCmpFk: { location: modelChangeSetModule, identifier: 'model2', initial: 'Model 2'},
			ChangeCount: { location: modelChangeSetModule, identifier: 'diffCount', initial: 'Differences' },
			ChangeSetStatusFk: { location: modelChangeSetModule, identifier: 'state', initial: 'State' },
			Status: { location: modelChangeSetModule, identifier: 'state', initial: 'State' },
			CompareModelColumns: { location: modelChangeSetModule, identifier: 'modelColumnsIncluded', initial: 'Model Columns' },
			CompareObjects: { location: modelChangeSetModule, identifier: 'objectsIncluded', initial: 'Objects' },
			CompareObjectLocations: {location: modelChangeSetModule, identifier: 'objLocsIncluded'},
			CompareProperties: { location: modelChangeSetModule, identifier: 'propertiesIncluded', initial: 'Properties' },
			ExcludeOpenings: { location: modelChangeSetModule, identifier: 'excludeOpenings', initial: 'No Openings' },
			optionsGroup: { location: modelChangeSetModule, identifier: 'options' },
			resultsGroup: { location: modelChangeSetModule, identifier: 'results' },
			logGroup: { location: modelChangeSetModule, identifier: 'log' },
			LoggingLevel: { location: modelChangeSetModule, identifier: 'logLevel' },
			StoredLog: { location: modelChangeSetModule, identifier: 'storedLog' }
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
