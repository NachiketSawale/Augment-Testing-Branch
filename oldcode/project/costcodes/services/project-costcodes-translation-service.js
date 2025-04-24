/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let projectCostCodesModule = 'project.costcodes';
	let cloudCommonModule = 'cloud.common';
	let basicsCostCodesModule = 'basics.costcodes';
	let basicsCommonModule = 'basics.common';

	/**
	 * @ngdoc service
	 * @name projectCostCodesTranslationService
	 * @description provides translation for project costcodes module
	 */
	angular.module(projectCostCodesModule).factory('projectCostCodesTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService', 'basicsCostCodesTranslationService',

		function (platformTranslateService, platformTranslationUtilitiesService, basicsCostCodesTranslationService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [projectCostCodesModule, cloudCommonModule, basicsCostCodesModule, basicsCommonModule]
			};

			data.words = {
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				userDefText: { location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'User Defined Text' },
				assignments:{ location: basicsCostCodesModule, identifier: 'assignments', initial: 'Assignments' },
				Rate: { location: projectCostCodesModule, identifier: 'rate', initial: 'Rate(Project)' },
				DayWorkRate: { location: projectCostCodesModule, identifier: 'dayWorkRate', initial: 'DW/T+M Rate(Project)' },
				EstCostTypeFk: { location: projectCostCodesModule, identifier: 'costType', initial: 'Cost Type(Project)' },
				UomFk: { location: projectCostCodesModule, identifier: 'uoM', initial: 'UoM(Project)' },
				CurrencyFk: { location: projectCostCodesModule, identifier: 'currency', initial: 'Currency(Project)' },
				FactorCosts: { location: projectCostCodesModule, identifier: 'factorCosts', initial: 'Factor (Project Costs)' },
				FactorQuantity: { location: projectCostCodesModule, identifier: 'factorQuantity', initial: 'Factor (Project Quantity)' },
				RealFactorCosts: { location: projectCostCodesModule, identifier: 'realFactorCosts', initial: 'RealFactor (Project Costs)' },
				RealFactorQuantity: { location: projectCostCodesModule, identifier: 'realFactorQuantity', initial: 'RealFactor (Project Quantity)' },
				FactorHour: { location: projectCostCodesModule, identifier: 'factorHour', initial: 'Factor (Project Hour)' },
				IsLabour:{ location: projectCostCodesModule, identifier: 'isLabour', initial: 'IsLabour(Project)' },
				IsRate:{ location: projectCostCodesModule, identifier: 'isRate', initial: 'IsRate(Project)' },
				IsDefault:{ location: projectCostCodesModule, identifier: 'isDefault', initial: 'IsDefault(Project)' },
				Remark:{ location: projectCostCodesModule, identifier: 'remark', initial: 'Remark(Project)' },
				LgmJobFk: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: 'Job'},
				IsEditable:{ location: projectCostCodesModule, identifier: 'isEditable', initial: 'Editable(Project)' },
				'BasCostCode.Rate' : {location: projectCostCodesModule, identifier: 'priceListRate', initial: 'Rate'},
				CostCodeTypeFk: { location: projectCostCodesModule, identifier: 'entityType', initial: 'Type' },
				AbcClassificationFk: { location: basicsCostCodesModule, identifier: 'abcClassification', initial: 'Abc Classification' },
				CostCodePortionsFk: { location: basicsCostCodesModule, identifier: 'costCodePortions', initial: 'CostCodePortions' },
				CostGroupPortionsFk: { location: basicsCostCodesModule, identifier: 'costGroupPortions', initial: 'CostGroupPortions' },
				PrcStructureFk: { location: basicsCostCodesModule, identifier: 'prcStructure', initial: 'Procurement Structure'},
				IsBudget : {location: basicsCostCodesModule, identifier: 'isBudget', initial: 'Budget'},
				IsCost : {location: basicsCostCodesModule, identifier: 'isCost', initial: 'Cost'},
				IsChildAllowed : {location: projectCostCodesModule, identifier: 'isPrjChildAllowed', initial: 'Project Child Allowed'},
				ContrCostCodeFk: { location: basicsCostCodesModule, identifier: 'controllingCostCode', initial: 'Controlling Cost Code' },
				Description2 : {location: basicsCostCodesModule, identifier: 'description2', initial: 'Further Description'},
				EfbType221Fk : {location: basicsCostCodesModule, identifier: 'efbType221', initial: 'EFB Type 221'},
				EfbType222Fk : {location: basicsCostCodesModule, identifier: 'efbType222', initial: 'EFB Type 222'},
				SalesPrice: { location: projectCostCodesModule, identifier: 'dayWorkRate', initial: 'DW/T+M Rate(Project)' },
				Co2Source:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Source', initial: 'CO2/kg (Source)'},
				Co2SourceFk:{location: basicsCommonModule, identifier: 'sustainabilty.entityBasCo2SourceFk', initial: 'CO2/kg (Source Name)'},
				Co2Project:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Project', initial: 'CO2/kg (Project)'},
				VhbSheetDjcTypeFk : {location: basicsCostCodesModule, identifier: 'vhbSheetDjcTypeFk', initial: 'VHB Sheet DJC Type'},
				VhbSheetGcTypeFk : {location: basicsCostCodesModule, identifier: 'vhbSheetGcTypeFk', initial: 'VHB Sheet GC Type'},
				IsSubcontractedWork : {location: basicsCostCodesModule, identifier: 'isSubcontractedWork', initial: 'Subcontracted Work'},
				IsCorporateWork : {location: basicsCostCodesModule, identifier: 'isCorporateWork', initial: 'Corporate Work'},
				IsConsortiumWork : {location: basicsCostCodesModule, identifier: 'isConsortiumWork', initial: 'Consortium Work'}
			};

			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined', '', 'userDefText');

			//Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			service.getTranslationInformation = function (key) {
				let information = data.words[key];

				if(key.indexOf('.') >= 0 && key !== 'BasCostCode.Rate'){
					key = key.substring(key.indexOf('.')+1);
					information = basicsCostCodesTranslationService.getTranslationInformation(key);//------ //check here
				}
				return information;
			};

			service.getTranslate = function () {
				return data.translate;
			};

			platformTranslationUtilitiesService.loadModuleTranslation(data);

			service.loadTranslations = function () {
				platformTranslationUtilitiesService.reloadModuleTranslation(data);
			};


			service.registerUpdates = function (callback) {
				data.updateCallback = callback;
				platformTranslateService.translationChanged.register(service.loadTranslations);
			};

			service.unregisterUpdates = function () {
				data.updateCallback = null;
				platformTranslateService.translationChanged.unregister(service.loadTranslations);
			};

			// register a module - translation table will be reloaded if module isn't available yet
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
