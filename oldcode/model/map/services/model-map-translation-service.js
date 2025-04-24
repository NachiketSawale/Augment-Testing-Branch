/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const modelMapModule = 'model.map';
	const cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name modelMapTranslationService
	 * @description provides translation for model project module
	 */

	angular.module(modelMapModule).factory('modelMapTranslationService',
		modelMapTranslationService);

	modelMapTranslationService.$inject = ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules'];

	function modelMapTranslationService(platformTranslationUtilitiesService,
		modelViewerTranslationModules) {

		const service = {};

		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				modelMapModule,
				cloudCommonModule
			].concat(modelViewerTranslationModules)
		};

		data.words = {
			IsDefault: {location: modelMapModule, identifier: 'isdefault', initial: 'Is Default'},
			ModelFk: {location: modelMapModule, identifier: 'modelfk', initial: 'Model'},
			MapFk: {location: modelMapModule, identifier: 'mapfk', initial: 'Map'},
			LocationFk: {location: modelMapModule, identifier: 'locationfk', initial: 'Location'},
			PrjDocumentFk: {location: modelMapModule, identifier: 'prjdocumentfk', initial: 'Document'},
			Points: {location: modelMapModule, identifier: 'points', initial: 'Points'},
			ZMin: {location: modelMapModule, identifier: 'zmin', initial: 'Minimal Height'},
			ZMax: {location: modelMapModule, identifier: 'zmax', initial: 'Maximal Height'},
			OrientationAngle: {location: modelMapModule, identifier: 'orientationangle', initial: 'Orientation Angle'},
			TranslationX: {location: modelMapModule, identifier: 'translationx', initial: 'Translation X'},
			TranslationY: {location: modelMapModule, identifier: 'translationy', initial: 'Translation Y'},
			Scale: {location: modelMapModule, identifier: 'scale', initial: 'Scale'},
			ZLevel: {location: modelMapModule, identifier: 'zlevel', initial: 'Z Level'},
			ViewingDistance: {location: modelMapModule, identifier: 'viewingdistance', initial: 'Viewing Distance'},
			IsUp: {location: modelMapModule, identifier: 'isup', initial: 'Is Up'}
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

		return service;
	}
})(angular);
