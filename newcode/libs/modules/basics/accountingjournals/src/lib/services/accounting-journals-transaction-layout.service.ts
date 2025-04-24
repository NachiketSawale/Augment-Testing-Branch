/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IAccountingJournalsTransactionEntity } from '../model/entities/accounting-journals-transaction-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementShareInvoiceLookupService, ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { PrcProjectStockLookupService } from '@libs/procurement/shared';
import { SalesSharedBillingLookupService, SalesSharedWipLookupService } from '@libs/sales/shared';

/**
 * Accounting Journals Transaction layout service
 */
@Injectable({
	providedIn: 'root',
})
export class AccountingJournalsTransactionLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IAccountingJournalsTransactionEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'DocumentType',
						'Currency',
						'PostingDate',
						'VoucherNumber',
						'VoucherDate',
						'Account',
						'OffsetAccount',
						'PostingNarritive',
						'Amount',
						'AmountOc',
						'Quantity',
						'PesHeaderFk',
						'InvHeaderFk',
						'NominalDimension',
						'NominalDimension2',
						'NominalDimension3',
						'PostingArea',
						'WipHeaderFk',
						'BilHeaderFk',
						'PrrHeaderDes',
						'PrjStockFk',
						'IsCancel'
					]
				},
				{
					gid: 'controllingUnit',
					title: {
						text: 'Controlling Unit',
						key: 'cloud.common.entityControllingUnit'
					},
					attributes: [
						'ControllingUnitCode',
						'ControllingUnitAssign01',
						'ControllingUnitAssign01Desc',
						'ControllingUnitAssign02',
						'ControllingUnitAssign02Desc',
						'ControllingUnitAssign03',
						'ControllingUnitAssign03Desc',
						'ControllingUnitAssign04',
						'ControllingUnitAssign04Desc',
						'ControllingUnitAssign05',
						'ControllingUnitAssign05Desc',
						'ControllingUnitAssign06',
						'ControllingUnitAssign06Desc',
						'ControllingUnitAssign07',
						'ControllingUnitAssign07Desc',
						'ControllingUnitAssign08',
						'ControllingUnitAssign08Desc',
						'ControllingUnitAssign09',
						'ControllingUnitAssign09Desc',
						'ControllingUnitAssign10',
						'ControllingUnitAssign10Desc',
					]
				},
				{
					gid: 'offsetContUnit',
					title: {
						text: 'Offset Cont Unit',
						key: 'basics.accountingJournals.entityOffsetContUnit'
					},
					attributes: [
						'OffsetContUnitCode',
						'OffsetContUnitAssign01',
						'OffsetContUnitAssign01Desc',
						'OffsetContUnitAssign02',
						'OffsetContUnitAssign02Desc',
						'OffsetContUnitAssign03',
						'OffsetContUnitAssign03Desc',
						'OffsetContUnitAssign04',
						'OffsetContUnitAssign04Desc',
						'OffsetContUnitAssign05',
						'OffsetContUnitAssign05Desc',
						'OffsetContUnitAssign06',
						'OffsetContUnitAssign06Desc',
						'OffsetContUnitAssign07',
						'OffsetContUnitAssign07Desc',
						'OffsetContUnitAssign08',
						'OffsetContUnitAssign08Desc',
						'OffsetContUnitAssign09',
						'OffsetContUnitAssign09Desc',
						'OffsetContUnitAssign10',
						'OffsetContUnitAssign10Desc'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.accountingJournals.', {
					PostingDate: {key: 'entityPostingDate', text: 'Posting Date'},
					Account: {key: 'entityAccount', text: 'Account'},
					PesHeaderFk: {key: 'entityPesHeaderFk', text: 'Pes Header'},
					InvHeaderFk: {key: 'entityInvHeaderFk', text: 'Inv Header'},
					NominalDimension: {key: 'entityNominalDimension', text: 'Nominal Dimension'},
					NominalDimension2: {key: 'entityNominalDimension2', text: 'Nominal Dimension 2'},
					NominalDimension3: {key: 'entityNominalDimension3', text: 'Nominal Dimension 3'},
					WipHeaderFk: {key: 'entityWipHeaderFk', text: 'WIP Code'},
					PrrHeaderDes: {key: 'entityPrrHeaderFkDesc', text: 'Revenue Recognition'},
					PrjStockFk: {key: 'entityPrjStockFk', text: 'Stock Header'},
					IsCancel: {key: 'entityIsCancel', text: 'Is Cancel'},
					BilHeaderFk: {key: 'entityBillNo', text: 'Bill No.'},
				}),
				...prefixAllTranslationKeys('basics.company.', {
					PostingArea: {key: 'entityPostingArea', text: 'Posting Area'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DocumentType: {key: 'entityDocumentType', text: 'Offset Cont Unit'},
					Currency: {key: 'entityCurrency', text: 'Offset Cont Unit'},
					VoucherNumber: {key: 'entityVoucherNumber', text: 'Voucher Number'},
					VoucherDate: {key: 'entityVoucherDate', text: 'Voucher Date'},
					OffsetAccount: {key: 'entityOffsetAccount', text: 'Offset Account'},
					PostingNarritive: {key: 'entityPostingNarritive', text: 'Posting Narritive'},
					Amount: {key: 'entityAmount', text: 'Amount'},
					AmountOc: {key: 'entityAmountOc', text: 'Amount Oc'},
					Quantity: {key: 'entityQuantity', text: 'Quantity'},
					ControllingUnitCode: {key: 'entityControllingUnitCode', text: 'Controlling Unit Code'},
					ControllingUnitAssign01: {key: 'entityControllingUnitAssign01', text: 'ControllingUnitAssign01'},
					ControllingUnitAssign01Desc: {key: 'entityControllingUnitAssign01Desc', text: 'Controlling Unit Assign 01 Desc'},
					ControllingUnitAssign02: {key: 'entityControllingUnitAssign02', text: 'ControllingUnitAssign02'},
					ControllingUnitAssign02Desc: {key: 'entityControllingUnitAssign02Desc', text: 'Controlling Unit Assign 02 Desc'},
					ControllingUnitAssign03: {key: 'entityControllingUnitAssign03', text: 'ControllingUnitAssign03'},
					ControllingUnitAssign03Desc: {key: 'entityControllingUnitAssign03Desc', text: 'Controlling Unit Assign 03 Desc'},
					ControllingUnitAssign04: {key: 'entityControllingUnitAssign04', text: 'ControllingUnitAssign04'},
					ControllingUnitAssign04Desc: {key: 'entityControllingUnitAssign04Desc', text: 'Controlling Unit Assign 04 Desc'},
					ControllingUnitAssign05: {key: 'entityControllingUnitAssign05', text: 'ControllingUnitAssign05'},
					ControllingUnitAssign05Desc: {key: 'entityControllingUnitAssign05Desc', text: 'Controlling Unit Assign 05 Desc'},
					ControllingUnitAssign06: {key: 'entityControllingUnitAssign06', text: 'ControllingUnitAssign06'},
					ControllingUnitAssign06Desc: {key: 'entityControllingUnitAssign06Desc', text: 'Controlling Unit Assign 06 Desc'},
					ControllingUnitAssign07: {key: 'entityControllingUnitAssign07', text: 'ControllingUnitAssign07'},
					ControllingUnitAssign07Desc: {key: 'entityControllingUnitAssign07Desc', text: 'Controlling Unit Assign 07 Desc'},
					ControllingUnitAssign08: {key: 'entityControllingUnitAssign08', text: 'ControllingUnitAssign08'},
					ControllingUnitAssign08Desc: {key: 'entityControllingUnitAssign08Desc', text: 'Controlling Unit Assign 08 Desc'},
					ControllingUnitAssign09: {key: 'entityControllingUnitAssign09', text: 'ControllingUnitAssign09'},
					ControllingUnitAssign09Desc: {key: 'entityControllingUnitAssign09Desc', text: 'Controlling Unit Assign 09 Desc'},
					ControllingUnitAssign10: {key: 'entityControllingUnitAssign10', text: 'ControllingUnitAssign10'},
					ControllingUnitAssign10Desc: {key: 'entityControllingUnitAssign10Desc', text: 'Controlling Unit Assign 10 Desc'},
					OffsetContUnitCode: {key: 'entityOffsetContUnitCode', text: 'Offset Cont Unit Code'},
					OffsetContUnitAssign01: {key: 'entityOffsetContUnitAssign01', text: 'Offset Cont Unit Code Assign 01'},
					OffsetContUnitAssign01Desc: {key: 'entityOffsetContUnitAssign01Desc', text: 'Offset Cont Unit Code Assign 01 Desc'},
					OffsetContUnitAssign02: {key: 'entityOffsetContUnitAssign02', text: 'Offset Cont Unit Code Assign 02'},
					OffsetContUnitAssign02Desc: {key: 'entityOffsetContUnitAssign02Desc', text: 'Offset Cont Unit Code Assign 02 Desc'},
					OffsetContUnitAssign03: {key: 'entityOffsetContUnitAssign03', text: 'Offset Cont Unit Code Assign 03'},
					OffsetContUnitAssign03Desc: {key: 'entityOffsetContUnitAssign03Desc', text: 'Offset Cont Unit Code Assign 03 Desc'},
					OffsetContUnitAssign04: {key: 'entityOffsetContUnitAssign04', text: 'Offset Cont Unit Code Assign 04'},
					OffsetContUnitAssign04Desc: {key: 'entityOffsetContUnitAssign04Desc', text: 'Offset Cont Unit Code Assign 04 Desc'},
					OffsetContUnitAssign05: {key: 'entityOffsetContUnitAssign05', text: 'Offset Cont Unit Code Assign 05'},
					OffsetContUnitAssign05Desc: {key: 'entityOffsetContUnitAssign05Desc', text: 'Offset Cont Unit Code Assign 05 Desc'},
					OffsetContUnitAssign06: {key: 'entityOffsetContUnitAssign06', text: 'Offset Cont Unit Code Assign 06'},
					OffsetContUnitAssign06Desc: {key: 'entityOffsetContUnitAssign06Desc', text: 'Offset Cont Unit Code Assign 06 Desc'},
					OffsetContUnitAssign07: {key: 'entityOffsetContUnitAssign07', text: 'Offset Cont Unit Code Assign 07'},
					OffsetContUnitAssign07Desc: {key: 'entityOffsetContUnitAssign07Desc', text: 'Offset Cont Unit Code Assign 07 Desc'},
					OffsetContUnitAssign08: {key: 'entityOffsetContUnitAssign08', text: 'Offset Cont Unit Code Assign 08'},
					OffsetContUnitAssign08Desc: {key: 'entityOffsetContUnitAssign08Desc', text: 'Offset Cont Unit Code Assign 08 Desc'},
					OffsetContUnitAssign09: {key: 'entityOffsetContUnitAssign09', text: 'Offset Cont Unit Code Assign 09'},
					OffsetContUnitAssign09Desc: {key: 'entityOffsetContUnitAssign09Desc', text: 'Offset Cont Unit Code Assign 09 Desc'},
					OffsetContUnitAssign10: {key: 'entityOffsetContUnitAssign10', text: 'Offset Cont Unit Code Assign 10'},
					OffsetContUnitAssign10Desc: {key: 'entityOffsetContUnitAssign10Desc', text: 'Offset Cont Unit Code Assign 10 Desc'},
				}),
			},
			overloads: {
				PrrHeaderDes: {readonly: true},
				PesHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementSharePesLookupService,
						showDescription: true,
						descriptionMember: 'Description',
					}),
					readonly: true,
				},
				InvHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementShareInvoiceLookupService,
						showDescription: true,
						descriptionMember: 'Reference'
					}),
					readonly: true,
				},
				WipHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: SalesSharedWipLookupService,
					}),
					readonly: true,
					additionalFields:[
						{
							displayMember: 'DescriptionInfo.Translated',
							label: 'basics.accountingJournals.entityWipHeaderFkDesc',
							column: true,
							singleRow: true,
						},
					],
				},
				BilHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: SalesSharedBillingLookupService
					}),
					readonly: true,
					additionalFields:[
						{
							displayMember: 'DescriptionInfo.Translated',
							label: 'basics.accountingJournals.entityBillHeaderFkDesc',
							column: true,
							singleRow: true,
						},
					],
				},
				PrjStockFk: {
					visible: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PrcProjectStockLookupService
					}),
					readonly: true,
				}
			}
		};
	}
}