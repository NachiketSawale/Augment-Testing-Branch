/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order

	var moduleName = 'controlling.actuals';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var basicsCompanyModule = 'basics.company';
	let basicsCurrencyModule = 'basics.currency';
	let basicsExportModule = 'basics.export';

	/**
	 * @ngdoc service
	 * @name controllingActualsTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(moduleName).service('controllingActualsTranslationService', ControllingActualsTranslationService);

	ControllingActualsTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ControllingActualsTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, basicsCommonModule, cloudCommonModule, basicsCompanyModule, basicsCurrencyModule, basicsExportModule]
		};

		data.words = {
			Code:{location: basicsCommonModule, identifier:'entityCode',initial:'Code'},
			CompanyYearFk: {location: moduleName, identifier:'entityCompanyYearServiceFk',initial:'Company Year Service'},
			CompanyYearFkStartDate: {location: moduleName, identifier:'entityCompanyYearServiceFkStartDate',initial:'Company Year Service Start Date'},
			CompanyYearFkEndDate: {location: moduleName, identifier:'entityCompanyYearServiceFkEndDate',initial:'Company Year Service End Date'},
			CompanyPeriodFk: {location: moduleName, identifier: 'entityCompanyTradingPeriodFk', initial: 'Trading Period'},
			CompanyPeriodFkStartDate: {location: moduleName, identifier:'entityCompanyTradingPeriodFkStartDate',initial:'Trading Period Start Date'},
			CompanyPeriodFkEndDate: {location: moduleName, identifier:'entityCompanyTradingPeriodFkEndDate',initial:'Trading Period End Date'},
			StartDate: {location:moduleName, identifier:'entityStartDate', initial: 'Start Date'},
			EndDate: {location:moduleName, identifier:'entityEndDate', initial: 'End Date'},
			ValueTypeFk: {location: moduleName, identifier: 'entityValueTypeFk', initial: 'Value Type'},
			HasCostCode:{location: moduleName, identifier: 'entityHasCostCode', initial: 'Has Cost Code'},
			HasContCostCode: {location: moduleName, identifier: 'entityHasControllingCostCode', initial: 'Has Controlling Cost Code'},
			HasAccount: {location: moduleName, identifier: 'entityHasAccount', initial: 'Has Account'},
			CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
			MdcControllingUnitFk:{location: moduleName, identifier: 'entityControllingUnitFk', initial: 'Controlling Unit'},
			MdcCostCodeFk: {location: moduleName, identifier: 'entityCostCodeFk', initial: 'Cost Code'},
			MdcContrCostCodeFk: {location: moduleName, identifier: 'entityControllingCodeFk', initial: 'Controlling Code'},
			AccountFk: {location: moduleName, identifier: 'entityAccountFk', initial: 'Account'},
			Quantity: {location: moduleName, identifier: 'entityQuantity', initial: 'Quantity'},
			Amount: {location: moduleName, identifier: 'entityAmount', initial: 'Amount'},
			CurrencyFk: {location: basicsCompanyModule, identifier: 'entityCurrencyFk', initial: 'Currency'},
			AmountOc: {location: moduleName, identifier: 'entityAmountOc', initial: 'Amount OC'},
			AmountProject: {location: moduleName, identifier: 'entityAmountProject', initial: 'Amount In Project'},
			IsFixedAmount: {location: moduleName, identifier: 'entityIsFixedAmount', initial: 'Fixed Amount'},
			ProjectFk: {location: moduleName, identifier: 'entityProjectFk', initial: 'Project'},
			Total: {location: moduleName, identifier: 'entityTotal', initial: 'Total'},
			TotalOc: {location: moduleName, identifier: 'entityTotalOc', initial: 'Total Oc'},
			UomFk: {location: moduleName, identifier: 'entityUomFk', initial: 'UOM'},
			NominalDimension1: {location: moduleName, identifier: 'nominalDimension1', initial: 'Nominal Dimension 1'},
			NominalDimension2: {location: moduleName, identifier: 'nominalDimension2', initial: 'Nominal Dimension 2'},
			NominalDimension3: {location: moduleName, identifier: 'nominalDimension3', initial: 'Nominal Dimension 3'},
			IsFinal: {location: moduleName, identifier: 'isFinal', initial: 'Is Final'}
			// Word: { location: controllingActualsModule, identifier: 'key', initial: 'English' }
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
