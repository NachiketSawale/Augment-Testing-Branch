/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const modelAnnotationModule = 'model.annotation';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const hsqeChecklistModule = 'hsqe.checklist';
	const modelProjectModule = 'model.project';
	const projectMainModule = 'project.main';

	/**
	 * @ngdoc service
	 * @name modelAnnotationTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(modelAnnotationModule).service('modelAnnotationTranslationService',
		ModelAnnotationTranslationService);

	ModelAnnotationTranslationService.$inject = ['platformTranslationUtilitiesService',
		'modelViewerTranslationModules'];

	function ModelAnnotationTranslationService(platformTranslationUtilitiesService,
		modelViewerTranslationModules) {

		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				modelAnnotationModule,
				basicsCommonModule,
				cloudCommonModule,
				hsqeChecklistModule,
				projectMainModule
			].concat(modelViewerTranslationModules)
		};

		data.words = {
			contextGroup: {location: modelAnnotationModule, identifier: 'contextGroup'},
			linkageGroup: {location: modelAnnotationModule, identifier: 'linkageGroup'},
			responsibilityGroup: {location: modelAnnotationModule, identifier: 'responsibilityGroup'},
			ModelFk: {location: modelProjectModule, identifier: 'model'},
			Uuid: {location: modelAnnotationModule, identifier: 'uuid'},
			DueDate: {location: modelAnnotationModule, identifier: 'dueDate'},
			PriorityFk: {location: modelAnnotationModule, identifier: 'priority'},
			StatusFk: {location: cloudCommonModule, identifier: 'entityStatus'},
			DefectFk: {location: modelAnnotationModule, identifier: 'defect'},
			InfoRequestFk: {location: modelAnnotationModule, identifier: 'rfi'},
			ViewpointFk: {location: modelAnnotationModule, identifier: 'viewpoint'},
			MeasurementFk: {location: modelAnnotationModule, identifier: 'value'},
			DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription'},
			ProjectFk: {location: modelAnnotationModule, identifier: 'project'},
			EffectiveCategoryFk: {location: modelAnnotationModule, identifier: 'category'},
			RawType: {location: modelAnnotationModule, identifier: 'type'},
			ClerkFk: {location: cloudCommonModule, identifier: 'entityClerk'},
			BusinessPartnerFk: {location: cloudCommonModule, identifier: 'entityBusinessPartner'},
			SubsidiaryFk: {location: cloudCommonModule, identifier: 'entitySubsidiary'},
			BpdContactFk: {location: projectMainModule, identifier: 'entityContact'},
			ReferenceTypeFk: {location: modelAnnotationModule, identifier: 'referenceType'},
			FromAnnotationFk: {location: modelAnnotationModule, identifier: 'fromAnnotation'},
			ToAnnotationFk: {location: modelAnnotationModule, identifier: 'toAnnotation'},
			ObjectFk: {location: modelAnnotationModule, identifier: 'object'},
			ObjectSetFk: {location: modelAnnotationModule, identifier: 'objectSet'},
			IsImportant: {location: modelAnnotationModule, identifier: 'important'},
			IsOrthographic: {location: modelAnnotationModule, identifier: 'orthographic'},
			BasDocumentTypeFk: {location: modelAnnotationModule, identifier: 'documentType'},
			DocumentDate: {location: cloudCommonModule, identifier: 'entityDate'},
			OriginFileName: {location: cloudCommonModule, identifier: 'documentOriginFileName', initial: 'Document Origin File Name' },
			LinkKind: {location: modelAnnotationModule, identifier: 'linkKind'},
			AnnotationDocumentTypeFk: {location: modelAnnotationModule, identifier: 'annoDocType'},
			Color: {location: modelAnnotationModule, identifier: 'color'},
			ShowInViewer: {location: modelAnnotationModule, identifier: 'showInViewer'},
			HsqChecklistFk: {location: modelAnnotationModule, identifier: 'hsqeChecklist'},
			ContextModelId: {location: modelAnnotationModule, identifier: 'contextModelId'},
			MarkerShapeFk: {location: modelAnnotationModule, identifier: 'markerShape'},
			PosX: {location: modelAnnotationModule, identifier: 'posX'},
			PosY: {location: modelAnnotationModule, identifier: 'posY'},
			PosZ: { location: modelAnnotationModule, identifier: 'posZ' },
			CameraFk: { location: modelAnnotationModule, identifier: 'cameraListTitle' }
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
