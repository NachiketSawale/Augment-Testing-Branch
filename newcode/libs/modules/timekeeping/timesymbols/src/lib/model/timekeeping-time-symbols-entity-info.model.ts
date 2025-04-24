/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { TimekeepingTimeSymbolsDataService } from '../services/timekeeping-time-symbols-data.service';
import { ITimeSymbolEntity } from '@libs/timekeeping/interfaces';
import { BasicsCompanyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, BasicsSharedTaxCodeLookupService } from '@libs/basics/shared';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingTimeSymbolsValidationService } from '../services/timekeeping-time-symbols-validation.service';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_TIME_SYMBOLS_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimeSymbolEntity>({
	grid: {
		title: { key: 'timekeeping.timesymbols' + '.timeSymbolListTitle'},
	},
	form: {
		title: { key: 'timekeeping.timesymbols' + '.timeSymbolDetailTitle' },
		containerUuid: '9d1103ff3dfb42ceae45f0991605761c',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeSymbolsDataService),
	validationService: ctx => ctx.injector.get(TimekeepingTimeSymbolsValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.TimeSymbols', typeName: 'TimeSymbolDto'},
	permissionUuid: '4e5bc29fd0a3407b8f2e7c0c224b578c',
	layoutConfiguration: async ctx => {
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<ITimeSymbolEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: ['Code', 'DescriptionInfo', 'IsDefault', 'Sorting',
						/* TODO 'Icon' type: imageselect, Framework issue?,*/
						'IsProductive', 'IsPresence', 'IsOffDay', 'IsOverNightTravel',
						'IsOvertime', 'IsTimeAccount', 'IsCUMandatory', 'IsUplift', 'IsExpense', 'ValuationPercent', 'ValuationRate',
						'TimeSymbolTypeFk', 'TimeSymbolGroupFk', 'CodeFinance', 'AdditionalCodeFinance', 'TimeSymbolFk', 'IsWtmRelevant',
						'TimeSymbolToCompany', 'IsVacation', 'UoMFk', 'CompanyFk', 'MdcTaxCodeFk', 'IsReporting', 'IsTravelTime',
						'IsTravelAllowance', 'IsSurcharges', 'IsTravelDistance', 'IsAction', 'IsTimeAllocation', 'IsAbsence', 'IsDriver']
				},
			],
			overloads: {
				CompanyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
					})
				},
				TimeSymbolTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimeSymbolTypeLookupOverload(false),
				TimeSymbolGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimeSymbolGroupLookupOverload(false),
				TimeSymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.timesymbols.entityExport'
				}),
				UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				MdcTaxCodeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTaxCodeLookupService,
						showClearButton: true
					})
				}
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {key: 'entityCode'},
					DescriptionInfo: {key: 'entityDescription'},
					IsDefault: {key: 'entityBankIsDefault'},
					Sorting: {key: 'entitySorting'},
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					Icon: {key: 'icon'},
				}),
				...prefixAllTranslationKeys('timekeeping.timesymbols.', {
					IsProductive: {key: 'entityIsProductive'},
					IsPresence: {key: 'entityIsPresence'},
					IsOffDay: {key: 'entityIsOffDay'},
					IsOvertime: {key: 'entityIsOvertime'},
					IsTimeAccount: {key: 'entityIsTimeAccount'},
					IsCUMandatory: {key: 'entityIsCUMandatory'},
					IsUplift: {key: 'entityIsUplift'},
					IsExpense: {key: 'entityIsExpense'},
					ValuationPercent: {key: 'entityValuationPercent'},
					ValuationRate: {key: 'entityValuationRate'},
					TimeSymbolTypeFk: {key: 'entityTimeSymbolTypeFk'},
					TimeSymbolGroupFk: {key: 'entityTimeSymbolGroupFk'},
					CodeFinance: {key: 'entityCodeFinance'},
					AdditionalCodeFinance: {key: 'entityAdditionalCodeFinance'},
					IsWtmRelevant: {key: 'entityIsWtmRelevant'},
					IsVacation: {key: 'entityIsVacation'},
					TimeSymbolToCompany: {key: 'timesymboltocompany'},
					UoMFk: {key: 'entityUomFk'},
					CompanyFk: {key: 'entityCompanyFk'},
					MdcTaxCodeFk: {key: 'entityMdcTaxCodeFk'},
					IsReporting: {key: 'entityIsReporting'},
					IsTravelTime: {key: 'entityIsTravelTime'},
					IsTravelAllowance: {key: 'entityIsTravelAllowance'},
					IsSurcharges: {key: 'entityIsSurcharges'},
					IsTravelDistance: {key: 'entityIsTravelDistance'},
					IsAction: {key: 'entityIsAction'},
					IsLive: {key: 'entityIsLive'},
					IsTimeAllocation: {key: 'entityIsTimeAllocation'},
					TimeSymbolFk: {key: 'entityExportTimeSymbol'},
					IsOverNightTravel: {key: 'entityIsOverNightTravel'},
					IsDriver: {key: 'entityIsDriver'},
					IsAbsence: {key: 'entityIsAbsence'}
				})
			}
		};
	}
});