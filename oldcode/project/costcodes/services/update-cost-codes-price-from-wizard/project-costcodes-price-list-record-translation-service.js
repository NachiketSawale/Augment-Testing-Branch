/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	let projectMainModule = 'project.main';
	angular.module(moduleName).factory('projectCostCodesPriceListRecordTranslationService',
		['platformTranslationUtilitiesService',
			function (platformTranslationUtilitiesService) {
				let service = {};
				let cloudCommonModule = 'cloud.common';
				let basicsCostCodesModule = 'basics.costcodes';
				let data = {
					toTranslate: {},
					translate: null,
					updateCallback: null,
					allUsedModules: [projectMainModule, cloudCommonModule, basicsCostCodesModule, moduleName]
				};
				data.words = {
					Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
					Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
					Rate: { location: basicsCostCodesModule, identifier: 'rate', initial: 'Rate(Project)' },
					DayWorkRate: { location: basicsCostCodesModule, identifier: 'dayWorkRate', initial: 'DW/T+M Rate(Project)' },
					FactorCosts: { location: basicsCostCodesModule, identifier: 'factorCosts', initial: 'Factor (Project Costs)' },
					FactorQuantity: { location: basicsCostCodesModule, identifier: 'factorQuantity', initial: 'Factor (Project Quantity)' },
					RealFactorCosts: { location: basicsCostCodesModule, identifier: 'realFactorCosts', initial: 'RealFactor (Project Costs)' },
					RealFactorQuantity: { location: basicsCostCodesModule, identifier: 'realFactorQuantity', initial: 'RealFactor (Project Quantity)' },
					FactorHour: { location: basicsCostCodesModule, identifier: 'factorHour', initial: 'Factor (Project Hour)' },
					UomFk: { location: basicsCostCodesModule, identifier: 'uoM', initial: 'UoM(Project)' },
					IsLabour:{ location: basicsCostCodesModule, identifier: 'isLabour', initial: 'IsLabour(Project)' },
					IsRate:{ location: basicsCostCodesModule, identifier: 'isRate', initial: 'IsRate(Project)' },
					CurrencyFk: { location: basicsCostCodesModule, identifier: 'currency', initial: 'Currency' },
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
						location: projectMainModule,
						identifier: 'priceListDayworkRate',
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
					Co2Project:{location: projectMainModule, identifier: 'updateCostCodeForJob.baseCo2Project', initial: 'CO2/kg (Project)'}
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