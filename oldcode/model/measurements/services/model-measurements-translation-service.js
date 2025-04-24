/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	const modelMeasurementsModule = 'model.measurements';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const modelProjectModule = 'model.project';
	const modelAnnotationModule = 'model.annotation';

	/**
	 * @ngdoc service
	 * @name modelMeasurementTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelMeasurementsModule).service('modelMeasurementTranslationService', ModelMeasurementTranslationService);

	ModelMeasurementTranslationService.$inject = ['platformTranslationUtilitiesService', 'modelViewerTranslationModules',];

	function ModelMeasurementTranslationService(platformTranslationUtilitiesService, modelViewerTranslationModules) {
		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				modelMeasurementsModule,
				basicsCommonModule,
				cloudCommonModule,
				modelAnnotationModule
			].concat(modelViewerTranslationModules)
		};

		data.words = {
			contextGroup: {location: modelMeasurementsModule, identifier: 'contextGroup'},
			ModelFk: {location: modelProjectModule, identifier: 'model'},
			DescriptionInfo: {location: modelMeasurementsModule, identifier: 'descriptioninfo'},
			MeasurementGroupFk: {location: modelMeasurementsModule, identifier: 'measurementgroupfk'},
			Code: {location: modelMeasurementsModule, identifier: 'code'},
			Type: {location: modelMeasurementsModule, identifier: 'type'},
			Color: {location: modelMeasurementsModule, identifier: 'color'},
			Value: {location: modelMeasurementsModule, identifier: 'value'},
			MeasurementFk :{location: modelMeasurementsModule, identifier:'measurementfk'},
			Sorting: {location: modelMeasurementsModule, identifier:'sorting'},
			ProjectFk: {location: modelMeasurementsModule, identifier: 'project'},
			Visible: {location: modelMeasurementsModule, identifier:'visible'},
			PosX: {location: modelMeasurementsModule, identifier:'posx'},
			PosY: {location: modelMeasurementsModule, identifier:'posy'},
			PosZ: {location: modelMeasurementsModule, identifier:'posz'},
			//FormattedValue: {location: modelMeasurementsModule, identifier: 'formattedvalue'},
			Uom: {location: modelMeasurementsModule, identifier:'uom'},
			//UomFk: {location: modelMeasurementsModule, identifier:'uomfk'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
