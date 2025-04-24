/**
 * Created by baf on 28.02.2018
 */

(function (angular) {
	'use strict';
	const logisticPriceModule = 'logistic.pricecondition';
	const logisticCommonModule = 'logistic.common';
	const cloudCommonModule = 'cloud.common';
	const basicsCustomizeModule = 'basics.customize';
	const logisticSundryServiceModule = 'logistic.sundryservice';
	const resourceWotModule = 'resource.wot';
	const basicsMaterialModule = 'basics.material';
	const resourceEquipmentGroupModule = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionTranslationService
	 * @description provides translation methods for logistic price module
	 */
	angular.module(logisticPriceModule).service('logisticPriceConditionTranslationService', LogisticPriceConditionTranslationService);

	LogisticPriceConditionTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function LogisticPriceConditionTranslationService(platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticPriceModule, cloudCommonModule, basicsCustomizeModule, logisticSundryServiceModule, resourceWotModule, 'cloud.desktop', 'resource.catalog', logisticCommonModule, basicsMaterialModule, resourceEquipmentGroupModule]
		};

		data.words = {
			LogisticContextFk: { location: basicsCustomizeModule, identifier: 'logisticscontext'},
			IsHandlingCharge: { location: logisticPriceModule, identifier: 'isHandlingCharge'},
			HandlingChargeFull: { location: logisticPriceModule, identifier: 'handlingChargeFull'},
			HandlingChargeReduced: { location: logisticPriceModule, identifier: 'handlingChargeReduced'},
			HandlingChargeExtern: { location: logisticPriceModule, identifier: 'handlingChargeExtern'},
			IsMultiple01: { location: logisticPriceModule, identifier: 'isMultiple01'},
			IsMultiple02: { location: logisticPriceModule, identifier: 'isMultiple02'},
			IsMultiple03: { location: logisticPriceModule, identifier: 'isMultiple03'},
			IsMultiple04: { location: logisticPriceModule, identifier: 'isMultiple04'},
			HandlingChargeRating01: { location: logisticPriceModule, identifier: 'handlingChargeRating01'},
			HandlingChargeRating02: { location: logisticPriceModule, identifier: 'handlingChargeRating02'},
			HandlingChargeRating03: { location: logisticPriceModule, identifier: 'handlingChargeRating03'},
			HandlingChargeRating04: { location: logisticPriceModule, identifier: 'handlingChargeRating04'},
			DepartureRatingPercent: { location: logisticPriceModule, identifier: 'departureRatingPercent'},
			WorkOperationTypeFk: { location: resourceWotModule, identifier: 'entityWorkOperationTypeFk'},
			PricingGroupFk: { location: basicsCustomizeModule, identifier: 'equipmentpricinggroup'},
			Percentage:{location: logisticPriceModule, identifier:'percentage'},
			Percentage01: { location: logisticPriceModule, identifier: 'percentage01'},
			Percentage02: { location: logisticPriceModule, identifier: 'percentage02'},
			Percentage03: { location: logisticPriceModule, identifier: 'percentage03'},
			Percentage04: { location: logisticPriceModule, identifier: 'percentage04'},
			Percentage05: { location: logisticPriceModule, identifier: 'percentage05'},
			Percentage06: { location: logisticPriceModule, identifier: 'percentage06'},
			ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom'},
			ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			EquipmentPriceListFk: { location: logisticPriceModule, identifier: 'entityPriceList'},
			SundryServicePriceListFk: { location: logisticPriceModule, identifier: 'entityPriceList'},
			Rate: { location: logisticCommonModule, identifier: 'costCodeRate'},
			SalesPrice: { location: logisticPriceModule, identifier: 'entitySalesPrice'},
			CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency'},
			EquipmentCatalogFk: { location: logisticPriceModule, identifier: 'entityCatalog'},
			MaterialCatalogFk: { location: logisticPriceModule, identifier: 'entityCatalog'},
			MaterialPriceListFk: { location: logisticPriceModule, identifier: 'entityMaterialPriceList'},
			MaterialPriceVersionFk: { location: logisticPriceModule, identifier: 'entityPriceVersion'},
			PlantFk: { location: logisticPriceModule, identifier: 'entityPlant'},
			IsManual: { location: logisticPriceModule, identifier: 'entityIsManual'},
			PricePortion1: { location: logisticSundryServiceModule, identifier: 'pricePortion01'},
			PricePortion2: { location: logisticSundryServiceModule, identifier: 'pricePortion02'},
			PricePortion3: { location: logisticSundryServiceModule, identifier: 'pricePortion03'},
			PricePortion4: { location: logisticSundryServiceModule, identifier: 'pricePortion04'},
			PricePortion5: { location: logisticSundryServiceModule, identifier: 'pricePortion05'},
			PricePortion6: { location: logisticSundryServiceModule, identifier: 'pricePortion06'},
			SundryServiceFk: { location: logisticPriceModule, identifier: 'sundryService'},
			SundryPriceListFk: { location: logisticPriceModule, identifier: 'entityPriceList'},
			MasterDataPriceListFk: { location: logisticPriceModule, identifier: 'entityMaterialPriceList'},
			MasterDataCostCodePriceVersionFk: { location: logisticPriceModule, identifier: 'costCodePriceVersion'},
			CostCodeFk: {location: logisticPriceModule, identifier: 'entityCostCode'},
			EvaluationOrder: {location: logisticPriceModule, identifier: 'evaluationOrder'},
			UomFk: {location: cloudCommonModule, identifier: 'entityUoM'},
			VolumeHandlingChargeReduced: {location: logisticPriceModule, identifier: 'volumeHandlingChargeReduced'},
			VolumeHandlingChargeFull: {location: logisticPriceModule, identifier: 'volumeHandlingChargeFull'},
			SundryServiceLoadingCostsFk: {location: logisticPriceModule, identifier: 'sundryServiceLoadingCostsFk'},
			Price: {location: cloudCommonModule, identifier: 'entityPrice'},
			MaterialFk: {location: basicsMaterialModule, identifier: 'record.material'},
			PlantGroupSpecValueFk: {location:logisticPriceModule, identifier:'plantGroupSpecValueFK'},
			DayWotFk: {location:logisticPriceModule, identifier:'dayWotFk'},
			HourWotFk: {location:logisticPriceModule, identifier:'hourWotFk'},
			MonthWotFk: {location:logisticPriceModule, identifier:'monthWotFk'},
			IdleWotFk: {location:logisticPriceModule, identifier:'idleWotFk'},
			PercentageHour: {location:logisticPriceModule, identifier:'percentageHour'},
			PercentageDay: {location:logisticPriceModule, identifier:'percentageDay'},
			PercentageMonth: {location:logisticPriceModule, identifier:'percentageMonth'},
			PercentageIdle: {location:logisticPriceModule, identifier:'percentageIdle'},
			PlantGroupFk:{ location:logisticPriceModule, identifier:'plantGroupFk'},
			UomDayFk:{location: logisticPriceModule, identifier:'uomDayFk'},
			UomHourFk:{location: logisticPriceModule, identifier:'uomHourFk'},
			UomMonthFk:{location : logisticPriceModule, identifier:'uomMonthFk'},
			UomIdleFk:{location: logisticPriceModule, identifier:'uomIdleFk'},
			Uom:{location: logisticPriceModule, identifier:'uom'}

		};
		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);