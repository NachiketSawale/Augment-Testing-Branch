/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let projectCostCodesModule = 'project.costcodes';
	let projectMainModule = 'project.main';
	angular.module(projectCostCodesModule).factory('projectCostCodesPriceListTranslationService',
		['platformTranslationUtilitiesService',
			function (platformTranslationUtilitiesService) {
				let service = {};
				let cloudCommonModule = 'cloud.common';
				let basicsCostCodesModule = 'basics.costcodes';
				let data = {
					toTranslate: {},
					translate: null,
					updateCallback: null,
					allUsedModules: [projectMainModule, cloudCommonModule, basicsCostCodesModule, projectCostCodesModule]
				};
				data.words = {
					IsChecked: {location: projectMainModule, identifier: 'isChecked', initial: 'Checked'},
					Status: {location: projectMainModule, identifier: 'updateCostCodeForJob.info', initial: 'Info'},
					Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
					'BasCostCode.Code': {location: projectMainModule, identifier: 'updateCostCodeForJob.baseCode', initial: 'Code(Base)'},
					NewCode: {location: projectMainModule, identifier: 'updateCostCodeForJob.newCode', initial: 'Code - New'},
					Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
					'BasCostCode.DescriptionInfo': {location: projectMainModule, identifier: 'updateCostCodeForJob.baseDescription', initial: 'Description(Base)'},
					NewDescription: {location: projectMainModule, identifier: 'updateCostCodeForJob.newDescription', initial: 'Description - New'},
					Rate: { location: projectCostCodesModule, identifier: 'rate', initial: 'Rate(Project)' },
					NewRate: {location: projectMainModule, identifier: 'updateCostCodeForJob.newRate', initial: 'Rate(New)'},
					DayWorkRate: { location: projectCostCodesModule, identifier: 'dayWorkRate', initial: 'DW/T+M Rate(Project)'},
					NewDayWorkRate: { location: projectMainModule, identifier: 'updateCostCodeForJob.newDayWorkRate', initial: 'DW/T+M Rate(New)'},
					FactorCosts: { location: projectCostCodesModule, identifier: 'factorCosts', initial: 'Factor (Project Costs)' },
					'BasCostCode.FactorCosts': {location: projectMainModule, identifier: 'updateCostCodeForJob.baseFactorCosts', initial: 'Factor(Base Costs)'},
					NewFactorCosts: {location: projectMainModule, identifier: 'updateCostCodeForJob.newFactorCosts', initial: 'FactorCosts(New)'},
					FactorQuantity: { location: projectCostCodesModule, identifier: 'factorQuantity', initial: 'Factor (Project Quantity)' },
					'BasCostCode.FactorQuantity': {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.baseFactorQuantity',
						initial: 'FactorQuantity(Base)'
					},
					NewFactorQuantity: {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.newFactorQuantity',
						initial: 'FactorQuantity(New)'
					},
					RealFactorCosts: { location: projectCostCodesModule, identifier: 'realFactorCosts', initial: 'RealFactor (Project Costs)' },
					'BasCostCode.RealFactorCosts': {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.baseRealFactorCosts',
						initial: 'RealFactorCosts(Base)'
					},
					NewRealFactorCosts: {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.newRealFactorCosts',
						initial: 'RealFactorCosts - New'
					},
					RealFactorQuantity: { location: projectCostCodesModule, identifier: 'realFactorQuantity', initial: 'RealFactor (Project Quantity)' },
					'BasCostCode.RealFactorQuantity': {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.baseRealFactorQuantity',
						initial: 'RealFactorQuantity(Base)'
					},
					NewRealFactorQuantity: {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.newRealFactorQuantity',
						initial: 'RealFactorQuantity - New'
					},
					FactorHour: { location: projectCostCodesModule, identifier: 'factorHour', initial: 'Factor (Project Hour)' },
					'BasCostCode.FactorHour': {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.baseFactorHour',
						initial: 'FactorHour(Base)'
					},
					NewFactorHour: {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.newFactorHour',
						initial: 'FactorHour - New'
					},
					UomFk: { location: projectCostCodesModule, identifier: 'uoM', initial: 'UoM(Project)' },
					'BasCostCode.CurrencyFk': {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.baseCurrency',
						initial: 'Currency(Base)'
					},
					CurrencyFk: { location: projectCostCodesModule, identifier: 'currency', initial: 'Currency(Project)' },
					NewCurrencyFk: {
						location: projectMainModule,
						identifier: 'updateCostCodeForJob.newCurrency',
						initial: 'Currency - New'
					},
					IsLabour:{ location: projectCostCodesModule, identifier: 'isLabour', initial: 'IsLabour(Project)' },
					IsRate:{ location: projectCostCodesModule, identifier: 'isRate', initial: 'IsRate(Project)' },
					JobCode: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: 'Job Code'},
					JobDescription: {
						location: projectCostCodesModule,
						identifier: 'lgmJobDescription',
						initial: 'Job Description'
					},
					MdcPriceListFk: {
						location: basicsCostCodesModule,
						identifier: 'priceList.priceList',
						initial: 'Price List'
					},
					JobCostCodePriceVersionFk: {
						location: basicsCostCodesModule,
						identifier: 'priceList.priceVersion',
						initial: 'Price Version'
					},
					Selected: {location: projectMainModule, identifier: 'isChecked', initial: 'Checked'},
					PriceListFk: {
						location: basicsCostCodesModule,
						identifier: 'priceList.priceList',
						initial: 'Price List'
					},
					PriceVersionFk: {
						location: basicsCostCodesModule,
						identifier: 'priceList.priceVersion',
						initial: 'Price Version'
					},
					SalesPrice: {
						location: basicsCostCodesModule,
						identifier: 'priceList.salesPrice',
						initial: 'Sales Price'
					},
					ValidFrom: {
						location: basicsCostCodesModule,
						identifier: 'priceVerion.validfrom',
						initial: 'Valid From'
					},
					ValidTo: {location: basicsCostCodesModule, identifier: 'priceVerion.validTo', initial: 'Valid To'},
					Weighting: {
						location: basicsCostCodesModule,
						identifier: 'priceVerion.weighting',
						initial: 'Weighting'
					},
					Co2Source:{location: projectMainModule, identifier: 'updateCostCodeForJob.baseCo2Source', initial: 'CO2/kg (Source)'},
					Co2SourceFk:{location: projectMainModule, identifier: 'updateCostCodeForJob.baseCo2SourceFk', initial: 'CO2/kg (Source Name)'},
					Co2Project:{location: projectMainModule, identifier: 'updateCostCodeForJob.baseCo2Project', initial: 'CO2/kg (Project)'},
					NewCo2Source:{location: projectMainModule, identifier: 'updateCostCodeForJob.newCo2Source', initial: 'CO2/kg (Source) - New'},
					NewCo2SourceFk:{location: projectMainModule, identifier: 'updateCostCodeForJob.newCo2SourceFk', initial: 'CO2/kg (Source Name) - New'},
					NewCo2Project:{location: projectMainModule, identifier: 'updateCostCodeForJob.newCo2Project', initial: 'CO2/kg (Project) - New'}
				};
				// Get some predefined packages of words used in project
				platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
				platformTranslationUtilitiesService.addHistoryTranslation(data.words);
				platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
				platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
				platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
				platformTranslationUtilitiesService.addModelAndSimulationTranslation(data.words, true);// true -> include models
				// Convert word list into a format used by platform translation service
				platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
				data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
				// Prepare interface of service and load translations
				platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
				platformTranslationUtilitiesService.loadModuleTranslation(data);
				platformTranslationUtilitiesService.registerModules(data);
				return service;
			}
		]);
})(angular);