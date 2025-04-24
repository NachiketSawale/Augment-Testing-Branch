/*
 * Copyright(c) RIB Software GmbH
 */


import {
	TimekeepingSettlementDataService,
	TimekeepingSettlementItemDataService
} from '../services';

/* for lookups
import {

} from '../../../../shared/src/lib/services/lookup';

 */

import {
	BasicsCompanyLookupService, BasicsShareControllingUnitLookupService,
	BasicsSharedClerkLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, BasicsSharedUomLookupService
} from '@libs/basics/shared';

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { TimekeepingPeriodLookupService } from '@libs/timekeeping/shared';
import { ITimekeepingSettlementEntity, ITimekeepingSettlementItemEntity } from '@libs/timekeeping/interfaces';

/**
 * Exports information about containers that will be rendered by this module.
 */
export class TimekeepingSettlementModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new TimekeepingSettlementModuleInfo();

	/**
	 * Initializes the module information of timekeeping settlement module
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'timekeeping.settlement';
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return [
			this.settlementEntityInfo,
			this.settlementItemEntityInfo
		];
	}

	/**
	 * Loads the translation file used for timekeeping settlement
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'timekeeping.common', 'cloud.common', 'basics.customize','basics.clerk', 'timekeeping.settlement'];
	}


	private readonly settlementEntityInfo: EntityInfo = EntityInfo.create( {
		grid: {
			title: { key: 'timekeeping.settlement.settlementListTitle' }
		},
		form: {
			containerUuid: '5608ca31f98343ee8fc34b832eabb893',
			title: { key: 'timekeeping.settlement.settlementDetailTitle' }
		},
		dataService: ctx => ctx.injector.get(TimekeepingSettlementDataService),
		dtoSchemeId: { moduleSubModule: 'Timekeeping.Settlement', typeName: 'TimekeepingSettlementDto' },
		permissionUuid: '128de81cbbe945759306123364a20cb1',

		layoutConfiguration : async ctx => {
			const projectLookupProvider = await ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
			return <ILayoutConfiguration<ITimekeepingSettlementEntity>>{
				groups: [
					{gid: 'default',attributes: [/*'SubsidiaryFk','SupplierFk',*/'Number', 'CompanyFk','CompanyChargedFk','ProjectFk','LanguageFk','VoucherTypeFk','InvoiceTypeFk',
							'ClerkFk','SettlementStatusFK','SettlementDate', 'SettlementNo', 'DescriptionInfo', 'PerformeFrom', 'PerformeTo', 'PostingDate','BusinesspartnerFk','CustomerFk',
							'TaxCodeFk','PaymentTermFk','JobTypeFk','DivisionFk','PeriodFk','VatGroupFk']},
				],
				overloads: {
					ClerkFk:{
						type: FieldType.Lookup,

						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedClerkLookupService
						})
					},
					CompanyFk:{
						type: FieldType.Lookup,

						lookupOptions: createLookup({
							dataServiceToken: BasicsCompanyLookupService
						})
					},
					CompanyChargedFk:{
						type: FieldType.Lookup,

						lookupOptions: createLookup({
							dataServiceToken: BasicsCompanyLookupService,
						})
					},
					PeriodFk: {
						type: FieldType.Lookup,
						readonly: false,
						lookupOptions: createLookup({
							dataServiceToken: TimekeepingPeriodLookupService,
						})
					},
					ProjectFk: projectLookupProvider.generateProjectLookup(),
					LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(true),
					SettlementStatusFK: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingSettlementStatusLookupOverload(true),
					VoucherTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideVoucherTypeReadonlyLookupOverload(),
					InvoiceTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceTypeReadonlyLookupOverload(),
					BusinesspartnerFk: BasicsSharedCustomizeLookupOverloadProvider.provideRfqBusinessPartnerStatusLookupOverload(false),
					CustomerFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(true),
					TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
					PaymentTermFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermPaDescription'),
					JobTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobTypeLookupOverload(true),
					DivisionFk: BasicsSharedCustomizeLookupOverloadProvider.provideEquipmentDivisionLookupOverload(true),
					VatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(false),

				},
				labels: {
					...prefixAllTranslationKeys('timekeeping.settlement.', {
						Number: {key:'number'},
						CompanyFk:{key:'companyfk'},
						SettlementDate: {key:'SettlementDate'},
						DescriptionInfo: {key:'entityDescriptionInfo'},
						SettlementNo: {key:'SettlementNo'},
						PerformeFrom: {key:'PerformeFrom'},
						PerformeTo: {key:'PerformeTo'},
						PostingDate: {key:'entityPostingDate'},
						LanguageFk:{key:'language'},
						SettlementStatusFK:{key:'statusfk'},
						CompanyChargedFk:{key:'companyCharged'},
						VoucherTypeFk:{key:'vouchertype'},
						InvoiceTypeFk:{key:'billinvoicetype'},
						BusinessPartnerFk:{key:'businessPartner'},
						CustomerFk:{key:'customer'},
						TaxCodeFk:{key:'taxcode'},
						PaymentTermFk:{key:'paymentTerm'},
						JobTypeFk:{key:'jobtype'},
						DivisionFk:{key:'divisionFk'},
						PeriodFk:{key:'PeriodFk'},
						VatGroupFk:{key:'entityVatGroupFk'},

					}),
					...prefixAllTranslationKeys('cloud.common.', {

						ProjectFk: {key: 'entityProject'},
					}),
					...prefixAllTranslationKeys('basics.clerk.', {
						ClerkFk:{key:'entityClerk'}
					})
				}
			};
		}
	}as IEntityInfo<ITimekeepingSettlementEntity>);


	private readonly settlementItemEntityInfo: EntityInfo = EntityInfo.create( {
		grid: {
			title: { key: 'timekeeping.settlement.settlementItemListTitle' }
		},
		form: {
			containerUuid: '643fbcea9f8a44df94c7483549af3ef0',
			title: { key: 'timekeeping.settlement.detailSettlementItemTitle' }
		},
		dataService: ctx => ctx.injector.get(TimekeepingSettlementItemDataService),
		dtoSchemeId: { moduleSubModule: 'Timekeeping.Settlement', typeName: 'TimekeepingSettlementItemDto' },
		permissionUuid: '6f4303109d94448bb98e71852946e039',
		layoutConfiguration: {
			groups: [{ gid: 'default-group', attributes: ['Price', 'Quantity','UomFk', 'ControllingUnitFk',/* 'ControllingUnitRevenueFk',*/'TaxCodeFk','SettledFrom','SettledTo'] }],
			overloads: {
				UomFk:{
					type: FieldType.Lookup,

					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService
					})
				},
				ControllingUnitFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService
					})
				},
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.settlement.', {
					Price: {key:'price'},
					Quantity: {key:'entityQuantityMultiplier'},
					SettledFrom: {key:'SettledFrom'},
					SettledTo: {key:'SettledTo'},
					ControllingUnitFk: {key:'entityControllingUnit'},
					ControllingUnitRevenueFk:{key: 'controllingUnitRevenue'},
					TaxCodeFk:{key: 'taxcode'},
					UomFk:{key: 'UomFk'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {

				}),
			},
		},
	}as IEntityInfo<ITimekeepingSettlementItemEntity>);

}

