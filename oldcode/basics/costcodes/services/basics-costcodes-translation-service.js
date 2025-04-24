/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let basicsCostCodesModule = 'basics.costcodes';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesTranslationService
	 * @description provides translation for basics costcodes module
	 */
	/* jshint -W106 */ // letiable name is according usage in translation json
	angular.module(basicsCostCodesModule).factory('basicsCostCodesTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsCostCodesModule, basicsCommonModule, cloudCommonModule]
			};

			data.words = {
				assignments:{ location: basicsCostCodesModule, identifier: 'assignments', initial: 'Assignments' },
				Description2: { location: basicsCostCodesModule, identifier: 'description2', initial: 'Further Description' },
				Description2Info: { location: basicsCostCodesModule, identifier: 'description2', initial: 'Further Description' },
				CostCodeTypesFk: { location: basicsCostCodesModule, identifier: 'costCodeTypes', initial: 'CostCodeTypes' },
				EstCostTypeFk: { location: basicsCostCodesModule, identifier: 'costType', initial: 'Cost Type' },
				AbcClassificationFk: { location: basicsCostCodesModule, identifier: 'abcClassification', initial: 'Abc Classification' },
				CostCodePortionsFk: { location: basicsCostCodesModule, identifier: 'costCodePortions', initial: 'CostCodePortions' },
				CostGroupPortionsFk: { location: basicsCostCodesModule, identifier: 'costGroupPortions', initial: 'CostGroupPortions' },
				PrcStructureFk: { location: basicsCostCodesModule, identifier: 'prcStructure', initial: 'Procurement Structure'},
				CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency' },
				FactorCosts: { location: basicsCostCodesModule, identifier: 'factorCosts', initial: 'Factor (Costs)' },
				FactorQuantity: { location: basicsCostCodesModule, identifier: 'factorQuantity', initial: 'Factor (Quantity)' },
				RealFactorCosts: { location: basicsCostCodesModule, identifier: 'realFactorCosts', initial: 'RealFactor (Costs)' },
				RealFactorQuantity: { location: basicsCostCodesModule, identifier: 'realFactorQuantity', initial: 'RealFactor (Quantity)' },
				FactorHour: { location: basicsCostCodesModule, identifier: 'factorHour', initial: 'Factor (Hour)' },
				Rate: { location: basicsCostCodesModule, identifier: 'rate', initial: 'Market Rate' },
				DayWorkRate: { location: basicsCostCodesModule, identifier: 'dayWorkRate', initial: 'DW/T+M Rate' },
				CostCodePriceListFk: { location: basicsCostCodesModule, identifier: 'costCodePriceListFk', initial: 'CostCodePriceList' },
				CostCodeTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type' },
				IsLabour: { location: basicsCostCodesModule, identifier: 'isLabour', initial: 'Labour Cost Code' },
				IsRate: { location: basicsCostCodesModule, identifier: 'isRate', initial: 'Fixed Unit Rate' },
				UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				ContrCostCodeFk: { location: basicsCostCodesModule, identifier: 'controllingCostCode', initial: 'Controlling Cost Code' },
				TechnicalCostCode: { location: basicsCostCodesModule, identifier: 'technicalCostCode', initial: 'Technical Cost Code' },
				IsChecked: { location: basicsCostCodesModule, identifier: 'canlookup', initial: 'Can Look Up' },
				CompanyName : { location: basicsCostCodesModule, identifier: 'companyName', initial: 'Company Name' },
				ResourceContextFk : {location: basicsCostCodesModule, identifier: 'resourceContext', initial: 'Resource Context'},
				ResTypeFk : {location: basicsCostCodesModule, identifier: 'resType', initial: 'Resource Type'},
				IsBudget : {location: basicsCostCodesModule, identifier: 'isBudget', initial: 'Budget'},
				IsCost : {location: basicsCostCodesModule, identifier: 'isCost', initial: 'Cost'},
				IsEditable : {location: basicsCostCodesModule, identifier: 'isEditable', initial: 'Editable'},
				IsProjectChildAllowed : {location: basicsCostCodesModule, identifier: 'isChildAllowed', initial: 'Child Allowed'},
				EfbType221Fk : {location: basicsCostCodesModule, identifier: 'efbType221', initial: 'EFB Type 221'},
				EfbType222Fk : {location: basicsCostCodesModule, identifier: 'efbType222', initial: 'EFB Type 222'},
				Co2Source:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Source', initial: 'CO2/kg (Source)'},
				Co2SourceFk:{location: basicsCommonModule, identifier: 'sustainabilty.entityBasCo2SourceFk', initial: 'CO2/kg (Source Name)'},
				Co2Project:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Project', initial: 'CO2/kg (Project)'},
				Source : {location: basicsCostCodesModule, identifier: 'source', initial: 'Source'},
				DetailsStack:{ location: basicsCostCodesModule, identifier: 'detailsstack', initial: 'Details Stack' },
				IsActive: {location: cloudCommonModule, identifier: 'entityIsActive', initial: 'IsActive'},
				VhbSheetDjcTypeFk : {location: basicsCostCodesModule, identifier: 'vhbSheetDjcTypeFk', initial: 'VHB Sheet DJC Type'},
				VhbSheetGcTypeFk : {location: basicsCostCodesModule, identifier: 'vhbSheetGcTypeFk', initial: 'VHB Sheet GC Type'},
				IsSubcontractedWork : {location: basicsCostCodesModule, identifier: 'isSubcontractedWork ', initial: 'Subcontracted Work'},
				IsCorporateWork : {location: basicsCostCodesModule, identifier: 'isCorporateWork', initial: 'Corporate Work'},
				IsConsortiumWork : {location: basicsCostCodesModule, identifier: 'isConsortiumWork', initial: 'Consortium Work'},
			};


			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined', '', 'userDefText');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
