/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	const plantSupplierModule = 'logistic.plantsupplier';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplierTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	// noinspection JSValidateTypes
	angular.module(plantSupplierModule).service('logisticPlantSupplierTranslationService', LogisticPlantSupplierTranslationService);

	LogisticPlantSupplierTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function LogisticPlantSupplierTranslationService(platformTranslationUtilitiesService) {
		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [plantSupplierModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: logisticPlantsupplierModule, identifier: 'key', initial: 'English' }
			Code: { location: plantSupplierModule, identifier: 'entityCode' },
			Description: { location: plantSupplierModule, identifier: 'entityDescription' },
			RubricCategoryFk: { location: plantSupplierModule, identifier: 'rubriccategory' },
			JobFk: { location: plantSupplierModule, identifier: 'entityJobFk'},
			ControllingUnitFk: { location: plantSupplierModule, identifier: 'performingControllingUnit' },
			ProjectStockFk: { location: plantSupplierModule, identifier: 'entityPrjStockFk' },
			IsActive: { location: plantSupplierModule, identifier: 'entityIsActive' },
			PlantSupplierFk: { location: plantSupplierModule, identifier: 'entityPlantSupplierFk' },
			ConsumptionDate: { location: plantSupplierModule, identifier: 'entityConsumptionDate' },
			MaterialFk: { location: plantSupplierModule, identifier: 'entityMaterialFk' },
			PlantFk: { location: plantSupplierModule, identifier: 'entityPlantFk' },
			Quantity: { location: plantSupplierModule, identifier: 'entityQuantity' },
			Price: { location: plantSupplierModule, identifier: 'entityPrice' },
			PlantSupplyItemStatusFk: { location: plantSupplierModule, identifier: 'entityPlantSupItemStatFk' },
			ExternalId: { location: plantSupplierModule, identifier: 'entityExternalId' },
			IsSettled: { location: plantSupplierModule, identifier: 'entityIsSettled' }
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations

		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
