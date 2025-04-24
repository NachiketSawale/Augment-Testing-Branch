/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var resourcePlantpricingModule = 'resource.plantpricing';
	var basicsCommonModule = 'basics.common';
	var basicsCustomizeModule = 'basics.customize';
	var cloudCommonModule = 'cloud.common';
	var resourceEquipmentModule = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(resourcePlantpricingModule).service('resourcePlantpricingTranslationService', ResourcePlantpricingTranslationService);

	ResourcePlantpricingTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourcePlantpricingTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourcePlantpricingModule, basicsCommonModule, basicsCustomizeModule, cloudCommonModule,resourceEquipmentModule]
		};

		data.words = {
			// Word: { location: resourcePlantpricingModule, identifier: 'key', initial: 'English' }
			CommentText: {location: cloudCommonModule, identifier: 'entityComment'},
			CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency' },
			EquipmentCalculationTypeFk: {location: basicsCustomizeModule, identifier: 'calculationtypefk'},
			EquipmentCatalogFk: { location: resourceEquipmentModule, identifier: 'entityCatalogFk' },
			EquipmentContextFk: { location: basicsCustomizeModule, identifier: 'equipmentcontextfk' },
			EquipmentDivisionFk: {location: basicsCustomizeModule, identifier: 'equipmentdivision'},
			Id: {location: cloudCommonModule, identifier: 'entityId'},
			IsLive: {location: basicsCustomizeModule, identifier: 'islive'},
			IsManualEditDispatching: {location: basicsCustomizeModule, identifier: 'ismanualeditdispatching'},
			IsManualEditJob: {location: basicsCustomizeModule, identifier: 'ismanualeditjob'},
			IsManualEditPlantMaster: {location: basicsCustomizeModule, identifier: 'ismanualeditplantmaster'},
			MasterDataContextFk: {location: basicsCustomizeModule, identifier: 'masterdatacontext'},
			MasterDataLineItemContextFk: {location: basicsCustomizeModule, identifier: 'lineitemcontext'},
			Percent: {location: basicsCustomizeModule, identifier: 'percent'},
			PricelistTypeFk: { location: basicsCustomizeModule, identifier: 'pricelisttypefk' },
			Priceportion1Name: { location: basicsCustomizeModule, identifier: 'priceportion1name' },
			Priceportion2Name: { location: basicsCustomizeModule, identifier: 'priceportion2name' },
			Priceportion3Name: { location: basicsCustomizeModule, identifier: 'priceportion3name' },
			Priceportion4Name: { location: basicsCustomizeModule, identifier: 'priceportion4name' },
			Priceportion5Name: { location: basicsCustomizeModule, identifier: 'priceportion5name' },
			Priceportion6Name: { location: basicsCustomizeModule, identifier: 'priceportion6name' },
			ReferenceYear: {location: basicsCustomizeModule, identifier: 'referenceyear'},
			UomFk: {location: basicsCustomizeModule, identifier: 'uomfk'},
			ValidFrom: {location: basicsCustomizeModule, identifier: 'validfrom'},
			ValidTo: {location: basicsCustomizeModule, identifier: 'validto'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
