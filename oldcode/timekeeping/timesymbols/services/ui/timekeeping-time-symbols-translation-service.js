/**
 * Created by nit on 07.05.2018.
 */
(function (angular) {
	'use strict';

	let timekeepingModule = 'timekeeping.timesymbols';
	let customizeModule = 'basics.customize';
	let cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsTranslationService
	 * @description provides translation for timekeeping time symbols module
	 */
	angular.module(timekeepingModule).factory('timekeepingTimeSymbolsTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [timekeepingModule, customizeModule, cloudCommonModule],
				words: {}
			};

			data.words = {
				Icon: {location: cloudCommonModule, identifier: 'entityIcon'},
				IsProductive: {location: timekeepingModule, identifier: 'entityIsProductive'},
				IsCUMandatory: {location: timekeepingModule, identifier: 'entityIsCUMandatory'},
				IsExpense: {location: timekeepingModule, identifier: 'entityIsExpense'},
				IsUplift: {location: timekeepingModule, identifier: 'entityIsUplift'},
				IsPresence:{location: timekeepingModule, identifier: 'entityIsPresence'},
				IsOvertime:{location: timekeepingModule, identifier: 'entityIsOvertime'},
				IsTimeAccount:{location: timekeepingModule, identifier: 'entityIsTimeAccount'},
				IsVacation: { location: timekeepingModule, identifier: 'entityIsVacation' },
				UoMFk: { location: timekeepingModule, identifier: 'entityUomFk' },
				CompanyFk: { location: timekeepingModule, identifier: 'entityCompanyFk' },
				TimeSymbolGroupFk:{location: timekeepingModule, identifier: 'entityTimeSymbolGroupFk'},
				ValuationPercent: {location: timekeepingModule, identifier: 'entityValuationPercent'},
				ValuationRate: {location: timekeepingModule, identifier: 'entityValuationRate'},
				TimeSymbolTypeFk: {location: timekeepingModule, identifier: 'entityTimeSymbolTypeFk'},
				TimeSymbolFk: {location: timekeepingModule, identifier: 'entityTimeSymbolFk'},
				SundryServiceFk: {location: timekeepingModule, identifier: 'entitySundryServiceFk'},
				IsWtmRelevant: {location: timekeepingModule, identifier: 'entityIsWtmRelevant'},
				CompanyChargedFk: {location: timekeepingModule, identifier: 'entityCompanyChargedFk'},
				SurchargeTypeFk: {location: timekeepingModule, identifier: 'entitySurchargeTypeFk'},
				CostGroupFk: {location: timekeepingModule, identifier: 'entityCostGroupFk'},
				ControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment'},
				CodeFinance: {location: timekeepingModule, identifier: 'entityCodeFinance'},
				AdditionalCodeFinance: {location: timekeepingModule, identifier: 'entityAdditionalCodeFinance'},
				TimeSymbolToCompany: { location: timekeepingModule, identifier: 'timesymboltocompany' },
				TimekeepingGroupFk: { location: timekeepingModule, identifier: 'entityTimekeepingGroup' },
				Comment: { location: timekeepingModule, identifier: 'comment' },
				IsReporting: { location: timekeepingModule, identifier: 'entityIsReporting' },
				IsTravelTime: { location: timekeepingModule, identifier: 'entityIsTravelTime' },
				IsTravelAllowance: { location: timekeepingModule, identifier: 'entityIsTravelAllowance' },
				IsSurcharges: { location: timekeepingModule, identifier: 'entityIsSurcharges' },
				IsAction: { location: timekeepingModule, identifier: 'entityIsAction' },
				IsTravelDistance: { location: timekeepingModule, identifier: 'entityIsTravelDistance' },
				IsTimeAllocation :{location: timekeepingModule, identifier: 'entityIsTimeAllocation'},
				IsOverNightTravel:{location: timekeepingModule, identifier: 'entityIsOverNightTravel'},
				IsAbsence:{location: timekeepingModule, identifier: 'entiyIsAbsence'},
				IsDriver:{location: timekeepingModule, identifier: 'entityIsDriver'},
				IsCreateTksResult:{location: timekeepingModule, identifier: 'entityIsCreateTksResult'},
				ExternalId: {location: timekeepingModule, identifier: 'entityExternalId'},

				ControllingGroup1Fk: {
					location: timekeepingModule,
					identifier: 'entityControllingGroup',
					param: {'p_0': '1'}
				},
				ControllingGroup2Fk: {
					location: timekeepingModule,
					identifier: 'entityControllingGroup',
					param: {'p_0': '2'}
				},
				ControllingGroup3Fk: {
					location: timekeepingModule,
					identifier: 'entityControllingGroup',
					param: {'p_0': '3'}
				},
				AccountCostFk: {location: timekeepingModule, identifier: 'entityAccount', param: {index: 'Cost'}},
				AccountRevFk: {location: timekeepingModule, identifier: 'entityAccount', param: {index: 'Revenue'}},
				AccountICCostFk: {
					location: timekeepingModule,
					identifier: 'entityAccount',
					param: {index: 'Inter Company Cost'}
				},
				AccountICRevFk: {
					location: timekeepingModule,
					identifier: 'entityAccount',
					param: {index: 'Inter Company Revenue'}
				},
				NominalDimension1Cost: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionCost',
					param: {'p_0': '1'}
				},
				NominalDimension2Cost: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionCost',
					param: {'p_0': '2'}
				},
				NominalDimension3Cost: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionCost',
					param: {'p_0': '3'}
				},
				NominalDimension1Rev: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionRev',
					param: {'p_0': '1'}
				},
				NominalDimension2Rev: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionRev',
					param: {'p_0': '2'}
				},
				NominalDimension3Rev: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionRev',
					param: {'p_0': '3'}
				},
				NominalDimension1ICCost: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionICCost',
					param: {'p_0': '1'}
				},
				NominalDimension2ICCost: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionICCost',
					param: {'p_0': '2'}
				},
				NominalDimension3ICCost: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionICCost',
					param: {'p_0': '3'}
				},
				NominalDimension1ICRev: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionICRev',
					param: {'p_0': '1'}
				},
				NominalDimension2ICRev: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionICRev',
					param: {'p_0': '2'}
				},
				NominalDimension3ICRev: {
					location: timekeepingModule,
					identifier: 'entityNominalDimensionICRev',
					param: {'p_0': '3'}
				},
				ControllingGrpDetail1CostFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailCost',
					param: {'p_0': '1'}
				},
				ControllingGrpDetail2CostFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailCost',
					param: {'p_0': '2'}
				},
				ControllingGrpDetail3CostFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailCost',
					param: {'p_0': '3'}
				},
				ControllingGrpDetail1RevFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailRev',
					param: {'p_0': '1'}
				},
				ControllingGrpDetail2RevFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailRev',
					param: {'p_0': '2'}
				},
				ControllingGrpDetail3RevFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailRev',
					param: {'p_0': '3'}
				},
				ControllingGrpDetail1ICCostFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailICCost',
					param: {'p_0': '1'}
				},
				ControllingGrpDetail2ICCostFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailICCost',
					param: {'p_0': '2'}
				},
				ControllingGrpDetail3ICCostFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailICCost',
					param: {'p_0': '3'}
				},
				ControllingGrpDetail1ICRevFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailICRev',
					param: {'p_0': '1'}
				},
				ControllingGrpDetail2ICRevFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailICRev',
					param: {'p_0': '2'}
				},
				ControllingGrpDetail3ICRevFk: {
					location: timekeepingModule,
					identifier: 'entityControllingGrpDetailICRev',
					param: {'p_0': '3'}
				},
				accounts: {location: timekeepingModule, identifier: 'entityAccounts'},
				IsOffDay: { location: timekeepingModule, identifier: 'entityIsOffDay' },
				MdcTaxCodeFk: { location: timekeepingModule, identifier: 'entityMdcTaxCodeFk' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

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
