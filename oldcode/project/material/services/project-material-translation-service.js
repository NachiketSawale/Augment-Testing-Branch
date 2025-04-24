/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let projectMaterialModule = 'project.material';
	let cloudCommonModule = 'cloud.common';
	let basicsMaterialModule = 'basics.material';
	let projectCostCodesModule = 'project.costcodes';
	let basicsCommonModule = 'basics.common';

	/**
	 * @ngdoc service
	 * @name projectMaterialTranslationService
	 * @description provides translation for project Material module
	 */
	angular.module(projectMaterialModule).factory('projectMaterialTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService', 'basicsMaterialTranslationService',

		function (platformTranslateService, platformTranslationUtilitiesService, basicsMaterialTranslationService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [projectMaterialModule, cloudCommonModule, basicsMaterialModule, projectCostCodesModule, basicsCommonModule]
			};

			data.words = {
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				EstimatePrice:{ location: projectMaterialModule, identifier: 'prjEstimatePrice', initial: 'Estimate Price(Project)'},

				CostPerUnit: { location: projectMaterialModule, identifier: 'CostPerUnit', initial: 'Cost Per Unit(Project)' },
				IsEstimatePrice: { location: projectMaterialModule, identifier: 'IsEstimatePrice', initial: 'Is Estimate Price(Project)' },
				IsDayWorkRate: { location: projectMaterialModule, identifier: 'IsDayWorkRate', initial: 'Is Daywork Rate(Project)' },
				CostCode: { location: cloudCommonModule, identifier: 'CostCode', initial: 'Cost Code' },
				Quantity:{ location: projectMaterialModule, identifier: 'Quantity', initial: 'Quantity' },

				UomFk: { location: projectCostCodesModule, identifier: 'uoM', initial: 'UoM(Project)' },
				EstCostTypeFk: { location: projectCostCodesModule, identifier: 'costType', initial: 'Cost Type(Project)' },
				BasCurrencyFk: { location: projectCostCodesModule, identifier: 'currency', initial: 'Currency(Project)'},
				RetailPrice:{ location: projectMaterialModule, identifier: 'prjRetailPrice', initial: 'Retail Price(Project)'},
				ListPrice:{ location: projectMaterialModule, identifier: 'prjListPrice', initial: 'List Price(Project)'},
				Charges:{ location: projectMaterialModule, identifier: 'prjCharges', initial: 'Charges(Project)'},
				Discount:{ location: projectMaterialModule, identifier: 'prjDiscount', initial: 'Discount(Project)'},
				PriceUnit:{ location: projectMaterialModule, identifier: 'prjPriceUnit', initial: 'Price Unit(Project)'},
				PriceExtra:{ location: projectMaterialModule, identifier: 'prjPriceExtra', initial: 'PriceExtra(Project)'},
				FactorPriceUnit:{ location: projectMaterialModule, identifier: 'prjFactorPriceUnit', initial: 'Factor Price Unit(Project)'},
				FactorHour:{ location: projectMaterialModule, identifier: 'factorHour', initial: 'Factor Hour(Project)'},
				Cost:{ location: projectMaterialModule, identifier: 'prjCost', initial: 'Cost(Project)'},

				BasUomPriceUnitFk:{ location: projectMaterialModule, identifier: 'prjBasUomPriceUnitFk', initial: 'Uom PriceUnit(Project)'},
				PrcPriceconditionFk:{ location: projectMaterialModule, identifier: 'prjPrcPriceConditionFk', initial: 'Prc Price Condition(Project)'},
				PriceConditionFk:{ location: projectMaterialModule, identifier: 'PriceConditionFk', initial: 'Prc Price Condition'},
				MaterialDiscountGroupFk:{ location: projectMaterialModule, identifier: 'prjMdcMaterialDiscountGroupFk', initial: 'Material Discount Group(Project)'},
				MdcTaxCodeFk:{ location: projectMaterialModule, identifier: 'prjMdcTaxCodeFk', initial: 'Tax Code(Project)'},

				CommentText:{ location: projectMaterialModule, identifier: 'prjComment', initial: 'Comment(Project)' },
				MdcMaterialPortionTypeFk: {location: projectMaterialModule, identifier: 'MdcMaterialPortionTypeFk', initial: 'Material Portion Type(project)'},

				// price condition
				PrcPriceConditionTypeFk: {location: cloudCommonModule, identifier: 'priceType', initial: 'Type'},
				Description: {location: cloudCommonModule, identifier: 'priceDescription', initial: 'Description'},
				Value: {location: cloudCommonModule, identifier: 'priceValue', initial: 'Value'},
				Total: {location: cloudCommonModule, identifier: 'priceTotal', initial: 'Total'},
				TotalOc: {location: cloudCommonModule, identifier: 'priceTotalOc', initial: 'TotalOc'},
				IsPriceComponent: {location: cloudCommonModule, identifier: 'priceComponent', initial: 'priceComponent'},
				LgmJobFk: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: 'Job'},
				DayWorkRate: { location: projectCostCodesModule, identifier: 'dayWorkRate', initial: 'DW/T+M Rate(Project)' },
				MaterialGroupFk: { location: basicsMaterialModule, identifier: 'materialGroup', initial: 'Material Group' },
				MaterialCatalogFk: { location: basicsMaterialModule, identifier: 'materialCatalog', initial: 'Material Catalog' },
				PrcStructureFk: { location: basicsMaterialModule, identifier: 'procurementStructure', initial: 'Material Group' },
				Co2Source:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Source', initial: 'CO2/kg (Source)'},
				Co2SourceFk:{location: basicsCommonModule, identifier: 'sustainabilty.entityBasCo2SourceFk', initial: 'CO2/kg (Source Name)'},
				Co2Project:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Project', initial: 'CO2/kg (Project)'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			service.getTranslationInformation = function (key) {
				let information = data.words[key];

				if(key.indexOf('.') >= 0){
					key = key.substring(key.indexOf('.')+1);
					information = key.indexOf('DayworkRate') >= 0 ? {location: projectMaterialModule, identifier: 'dayWorkRateBas', initial: 'DW/T+M Rate'}  : basicsMaterialTranslationService.getTranslationInformation(key);
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
