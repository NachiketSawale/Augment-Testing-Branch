/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let efbSheetModule = 'basics.efbsheets';
	let cloudCommonModule = 'cloud.common';
	let basicsCostCodesModule = 'basics.costcodes';
	let basicsCustomizeModule = 'basics.customize';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsTranslationService
     * @description provides translation for basics Efbsheets module
     */
	/* jshint -W106 */ // letiable name is according usage in translation json
	angular.module(efbSheetModule).factory('basicsEfbsheetsTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [efbSheetModule, cloudCommonModule,basicsCostCodesModule, basicsCustomizeModule]
			};

			data.words = {
				TotalHours: { location: efbSheetModule, identifier: 'totalHours', initial: 'Total Hours' },
				WorkingDaysMonths: { location: efbSheetModule, identifier: 'workingDaysMonths', initial: 'Working Days Months' },
				HoursDay: { location: efbSheetModule, identifier: 'hoursDay', initial: 'Hours Day' },
				CrewSize: { location: efbSheetModule, identifier: 'crewSize', initial: 'Crew Size' },
				CrewAverage: { location: efbSheetModule, identifier: 'crewAverage', initial: 'Crew Average' },
				WageIncrease1: { location: efbSheetModule, identifier: 'wageIncrease1', initial: 'Wage Increase1' },
				WageIncrease2: { location: efbSheetModule, identifier: 'wageIncrease2', initial: 'Wage Increase2' },
				WagePIncrease1: { location: efbSheetModule, identifier: 'wagePIncrease1', initial: 'Wage Percentage Increase1' },
				WagePIncrease2: { location: efbSheetModule, identifier: 'wagePIncrease2', initial: 'Wage Percentage Increase2' },
				HourPIncrease1: { location: efbSheetModule, identifier: 'hourPIncrease1', initial: 'Hour Percentage Increase1' },
				HourPIncrease2: { location: efbSheetModule, identifier: 'hourPIncrease2', initial: 'Hour Percentage Increase2' },
				ExtraPay: { location: efbSheetModule, identifier: 'extraPay', initial: 'Extra Pay' },
				AverageStandardWage: { location: efbSheetModule, identifier: 'averageStandardWage', initial: 'Average Standard Wage' },
				TotalSurcharge: { location: efbSheetModule, identifier: 'totalSurcharge', initial: 'Total Surcharge' },
				CrewMixAf: { location: efbSheetModule, identifier: 'crewMixAf', initial: 'Crew Mix A(F)' },
				TotalExtraCost: { location: efbSheetModule, identifier: 'totalExtraCost', initial: 'Total ExtraCost' },
				CrewMixAfsn: { location: efbSheetModule, identifier: 'crewMixAfsn', initial: 'Crew Mix A(F)SN' },
				MdcCostCodeFk: { location: cloudCommonModule, identifier: 'entityCostCode', initial: '*Cost Code' },
				CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency' },
				MdcWageGroupFk: { location: efbSheetModule, identifier: 'entityWageGroup', initial: 'Crew Composition' },

				Count: { location: efbSheetModule, identifier: 'count', initial: 'Count' },
				Supervisory: { location: efbSheetModule, identifier: 'supervisory', initial: 'Supervisory' },
				RateHour: { location: efbSheetModule, identifier: 'rateHour', initial: 'Rate Hour' },

				Markup: { location: efbSheetModule, identifier: 'markup', initial: 'Markup' },
				PercentHour: { location: efbSheetModule, identifier: 'percentHour', initial: 'Percent Hour' },
				PercentSurcharge: { location: efbSheetModule, identifier: 'percentSurcharge', initial: 'Percent Surcharge' },

				Expensives: { location: efbSheetModule, identifier: 'expensives', initial: 'Expensives' },
				MarkupCnaf: { location: efbSheetModule, identifier: 'markupCnaf', initial: 'Markup CNAF' },

				Rate: { location: efbSheetModule, identifier: 'rate', initial: 'Rate' },

				Project2mdcCstCdeFk: { location: cloudCommonModule, identifier: 'entityCostCode', initial: 'Cost Code' },

				CostcodePriceVerFk: { location: basicsCostCodesModule, identifier: 'priceList.priceVersionDescription'},
				CommentText:{ location: efbSheetModule, identifier: 'comment', initial: 'Comment' },
				MarkupRate: { location: basicsCustomizeModule, identifier: 'markupRate', initial: 'Markup Rate' }
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
