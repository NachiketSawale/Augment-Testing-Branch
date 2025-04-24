/**
 * Created by baf on 27.10.2017
 */

(function (angular) {

	'use strict';
	var resourceCatalogModule = 'resource.catalog';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name resourceCatalogTranslationService
	 * @description provides translation methods for resource catalog module
	 */
	angular.module(resourceCatalogModule).service('resourceCatalogTranslationService', ResourceCatalogTranslationService);

	ResourceCatalogTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceCatalogTranslationService(platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceCatalogModule, cloudCommonModule]
		};

		data.words = {
			CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency'},
			CatalogTypeFk: { location: resourceCatalogModule, identifier: 'catalogTypeFk'},
			Specification: { location: cloudCommonModule, identifier: 'EntitySpec'},
			characteristics: {location: cloudCommonModule, identifier: 'ContainerCharacteristicDefaultTitle'},
			measures: {location: resourceCatalogModule, identifier: 'entityMeasures'},
			configuration: {location: resourceCatalogModule, identifier: 'entityConfiguration'},
			depreciationinterest: {location: resourceCatalogModule, identifier: 'entityDepreciationInterest'},
			Equipment: { location: resourceCatalogModule, identifier: 'detEquipment'},
			Consumable: { location: resourceCatalogModule, identifier: 'detConsumable'},
			With: { location: resourceCatalogModule, identifier: 'entityWith'},
			Without: { location: resourceCatalogModule, identifier: 'entityWithout'},
			Characteristic1: { location: resourceCatalogModule, identifier: 'detChar1'},
			UoM1Fk: { location: resourceCatalogModule, identifier: 'detUoM1'},
			CharacteristicValue1: { location: resourceCatalogModule, identifier: 'detCharVal1'},
			Characteristic2: { location: resourceCatalogModule, identifier: 'detChar2'},
			UoM2Fk: { location: resourceCatalogModule, identifier: 'detUoM2'},
			CharacteristicValue2: { location: resourceCatalogModule, identifier: 'detCharVal2'},
			MeasureA: { location: resourceCatalogModule, identifier: 'detMeasureA'},
			UoMAFk: { location: resourceCatalogModule, identifier: 'detUoMA'},
			MeasureValueA: { location: resourceCatalogModule, identifier: 'detMeasValA'},
			MeasureB: { location: resourceCatalogModule, identifier: 'detMeasureB'},
			UoMBFk: { location: resourceCatalogModule, identifier: 'detUoMB'},
			MeasureValueB: { location: resourceCatalogModule, identifier: 'detMeasValB'},
			MeasureC: { location: resourceCatalogModule, identifier: 'detMeasureC'},
			UoMCFk: { location: resourceCatalogModule, identifier: 'detUoMC'},
			MeasureValueC: { location: resourceCatalogModule, identifier: 'detMeasValC'},
			MeasureD: { location: resourceCatalogModule, identifier: 'detMeasureD'},
			UoMDFk: { location: resourceCatalogModule, identifier: 'detUoMD'},
			MeasureValueD: { location: resourceCatalogModule, identifier: 'detMeasValD'},
			MeasureE: { location: resourceCatalogModule, identifier: 'detMeasureE'},
			UoMEFk: { location: resourceCatalogModule, identifier: 'detUoME'},
			MeasureValueE: { location: resourceCatalogModule, identifier: 'detMeasValE'},
			Weight: { location: resourceCatalogModule, identifier: 'detWeight'},
			MachineLive: { location: resourceCatalogModule, identifier: 'detMachineLive'},
			OperationMonthsFrom: { location: resourceCatalogModule, identifier: 'detOperationMonthsFrom'},
			OperationMonthsTo: { location: resourceCatalogModule, identifier: 'detOperationMonthsTo'},
			MonthlyFactorDepreciationInterestFrom: { location: resourceCatalogModule, identifier: 'detMonthlyFactorDIFrom'},
			MonthlyFactorDepreciationInterestTo: { location: resourceCatalogModule, identifier: 'detMonthlyFactorDITo'},
			MonthlyRepair: { location: resourceCatalogModule, identifier: 'detMonthlyRepair'},
			Flag: { location: resourceCatalogModule, identifier: 'detFlag'},
			ValueNew: { location: resourceCatalogModule, identifier: 'detValueNew'},
			WeightPercent: { location: resourceCatalogModule, identifier: 'detWeightPercent'},
			Reinstallment: { location: resourceCatalogModule, identifier: 'detReinstallment'},
			ReinstallmentPercent: { location: resourceCatalogModule, identifier: 'detReinstallmentPercent'},
			MonthlyRepairValue: { location: resourceCatalogModule, identifier: 'detMonthlyRepairValue'},
			MonthlyFactorDepreciationInterestValueFrom: { location: resourceCatalogModule, identifier: 'detMonthlyFactorDIValueFrom'},
			MonthlyFactorDepreciationInterestValueTo: { location: resourceCatalogModule, identifier: 'detMonthlyFactorDIValueTo'},
			ProducerPriceIndex: { location: resourceCatalogModule, identifier: 'detProducerPriceIndex'},
			BaseYear: { location: resourceCatalogModule, identifier: 'baseYear'},
			IndexYear: { location: resourceCatalogModule, identifier: 'indexYear'},
			PriceIndex: { location: resourceCatalogModule, identifier: 'priceYear'},
			CatalogCodeContentFk: { location: resourceCatalogModule, identifier: 'catalogCodeContent'},
			CharacteristicContent1: { location: resourceCatalogModule, identifier: 'characteristicContent1'},
			CharacterValueType1Fk: { location: resourceCatalogModule, identifier: 'characterValueType1Fk'},
			CharacteristicContent2: { location: resourceCatalogModule, identifier: 'characteristicContent2'},
			CharacterValueType2Fk: { location: resourceCatalogModule, identifier: 'characterValueType2Fk'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);