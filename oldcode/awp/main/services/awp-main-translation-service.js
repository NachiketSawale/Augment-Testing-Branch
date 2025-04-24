/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	const awpMainModule = 'awp.main';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const estimateMainModule = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name awpMainTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(awpMainModule).service('awpMainTranslationService', AwpMainTranslationService);

	AwpMainTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function AwpMainTranslationService(platformTranslationUtilitiesService) {
		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [awpMainModule, basicsCommonModule, cloudCommonModule, estimateMainModule]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			Code: { location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
			Quantity: {location: awpMainModule, identifier: 'quantity', initial: 'Quantity'},
			WqQuantity: {location: awpMainModule, identifier: 'wqQuantity', initial: 'WQ Quantity'},
			QuantityTotal: {location: estimateMainModule, identifier: 'quantityTotal', initial: 'Quantity Total'},
			BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
			UnitRate: {location: cloudCommonModule, identifier: 'entityUnitRate', initial: 'Unit Rate'},
			FinalPrice: {location: cloudCommonModule, identifier: 'entityFinalPrice', initial: 'Final Price'},
			GrandTotal: {location: estimateMainModule, identifier: 'grandTotal', initial: 'Grand Total'},
			GrandCostUnitTarget: {location: estimateMainModule, identifier: 'grandCostUnitTarget', initial: 'Grand Cost/Unit Item'},
			PrcStructureFk: {location: estimateMainModule, identifier: 'prcStructureFk', initial: 'Procurement Structure'},
			Reference: {location: awpMainModule, identifier:'reference', initial: 'Reference'},
			BriefInfo: {location: awpMainModule, identifier:'briefInfo', initial: 'Outline Specification'}
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
