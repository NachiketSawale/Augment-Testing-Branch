/*
 * $Id: resource-common-translation-service.js 602109 2020-09-04 14:10:45Z nitsche $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var cloudCommonModule = 'cloud.common';
	var resourceCommonModule = 'resource.common';

	/**
	 * @ngdoc service
	 * @name resourceCommonTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(resourceCommonModule).service('resourceCommonTranslationService', ResourceCommonTranslationService);

	ResourceCommonTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceCommonTranslationService(platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [cloudCommonModule, resourceCommonModule]
		};

		// Interface
		this.providePricePortionWords = function providePricePortionWords(words, count, preFix, interFix) {
			preFix = preFix || 'PricePortion';
			interFix = interFix || '';

			words.groupEntityPricePortions = { location: resourceCommonModule, identifier: 'groupEntityPricePortions', initial: 'Price Portions' };

			/* jshint -W106 */ // For me there is no cyclomatic complexity
			for (var j = 1; j <= count; ++j) {
				var createdName = preFix + interFix + j;
				words[createdName] = { location: resourceCommonModule, identifier: 'entityPricePortion', param: { p_0: '' + j }, initial: 'Text ' + j };

				if (j === 9) {
					interFix = '';
				}
			}
		};

		this.providePlantCatalogWords = function providePlantCatalogWords(words) {
			words.CatalogFk = { location: resourceCommonModule, identifier: 'entityPlantCatalog', initial: 'Plant Catalog' };
			words.CatalogRecordFk = { location: resourceCommonModule, identifier: 'entityPlantCatalogRecord', initial: 'Catalog Record' };
			words.IsTire = { location: resourceCommonModule, identifier: 'entityIsTire', initial: 'Is Tire' };
			words.IsTire = { location: resourceCommonModule, identifier: 'entityIsTire', initial: 'Is Tire' };
			words.IsInterpolated = { location: resourceCommonModule, identifier: 'entityIsInterpolated', initial: 'Is Interpolated' };
			words.IsManual = { location: resourceCommonModule, identifier: 'entityIsManual', initial: 'Is Manual' };
			words.OutputGeneralDev = {location: resourceCommonModule, identifier: 'gidGeneralDevTitle'};
			words.OutputUpperDev = {location: resourceCommonModule, identifier: 'gidOutputUpperDevTitle'};
			words.OutputLowerDev = {location: resourceCommonModule, identifier: 'gidOutputLowerDevTitle'};
			words.OutputCalcDev = {location: resourceCommonModule, identifier: 'gidOutputCalcDevTitle'};
		};

		this.provideEquipmentWords = function providePlantCatalogWords(words) {
			words.Description = {location: resourceCommonModule, identifier: 'entityDescription'};
			words.CatalogRecordLowerFk = {location: resourceCommonModule, identifier: 'entityCatalogRecordLower'};
			words.CatalogRecordUpperFk = {location: resourceCommonModule, identifier: 'entityCatalogRecordUpper'};
			words.DepreciationLowerFrom = {location: resourceCommonModule, identifier: 'entityDepreciationLowerFrom'};
			words.DepreciationLowerTo = {location: resourceCommonModule, identifier: 'entityDepreciationLowerTo'};
			words.DepreciationUpperFrom = {location: resourceCommonModule, identifier: 'entityDepreciationUpperFrom'};
			words.DepreciationUpperTo = {location: resourceCommonModule, identifier: 'entityDepreciationUpperTo'};
			words.DepreciationPercentFrom = {location: resourceCommonModule, identifier: 'entityDepreciationPercentFrom'};
			words.DepreciationPercentTo = {location: resourceCommonModule, identifier: 'entityDepreciationPercentTo'};
			words.Depreciation = {location: resourceCommonModule, identifier: 'entityDepreciation'};
			words.RepairUpper = {location: resourceCommonModule, identifier: 'entityRepairUpper'};
			words.RepairLower = {location: resourceCommonModule, identifier: 'entityRepairLower'};
			words.RepairPercent = {location: resourceCommonModule, identifier: 'entityRepairPercent'};
			words.RepairCalculated = {location: resourceCommonModule, identifier: 'entityRepairCalculated'};
			words.ReinstallmentLower = {location: resourceCommonModule, identifier: 'entityReinstallmentLower'};
			words.ReinstallmentUpper = {location: resourceCommonModule, identifier: 'entityReinstallmentUpper'};
			words.ReinstallmentCalculated = {location: resourceCommonModule, identifier: 'entityReinstallmentCalculated'};
			words.PriceIndexCalc = {location: resourceCommonModule, identifier: 'entityPriceIndexCalc'};
			words.PriceIndexLower = {location: resourceCommonModule, identifier: 'entityPriceIndexLower'};
			words.PriceIndexUpper = {location: resourceCommonModule, identifier: 'entityPriceIndexUpper'};
			words.OutputGeneralDev = {location: resourceCommonModule, identifier: 'gidGeneralDevTitle'};
			words.OutputUpperDev = {location: resourceCommonModule, identifier: 'gidOutputUpperDevTitle'};
			words.OutputLowerDev = {location: resourceCommonModule, identifier: 'gidOutputLowerDevTitle'};
			words.OutputCalcDev = {location: resourceCommonModule, identifier: 'gidOutputCalcDevTitle'};
		};

		this.providePlantPriceListWords = function providePlantPriceListWords(words) {
			words.PlantPriceListFk = { location: resourceCommonModule, identifier: 'entityPlantPriceList', initial: 'Price List' };
			words.ValidFrom = { location: cloudCommonModule, identifier: 'entityValidFrom', initial: 'Valid From' };
			words.ValidTo = { location: cloudCommonModule, identifier: 'entityValidTo', initial: 'Valid To' };
		};

		// Initialisation
		data.words = {
		};

		self.providePricePortionWords(data.words, 6);
		self.providePlantCatalogWords(data.words);
		self.providePlantPriceListWords(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);
