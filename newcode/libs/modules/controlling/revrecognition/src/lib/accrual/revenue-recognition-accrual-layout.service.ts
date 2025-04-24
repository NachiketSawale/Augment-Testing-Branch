/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';

/**
 * Controlling Revenue Recognition Accrual layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionAccrualLayoutService {

	/**
	 * Generate layout config
	 */

	public async generateLayout(): Promise<ILayoutConfiguration<ICompanyTransactionEntity>> {

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
						'IsCancel',
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
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'DocumentType': {
						text: 'Offset Cont Unit',
						key: 'entityDocumentType'
					},
					'Currency': {
						text: 'Currency',
						key: 'entityCurrency'
					},
					'VoucherNumber': {
						text: 'Voucher Number',
						key: 'entityVoucherNumber'
					},
					'VoucherDate': {
						text: 'Voucher Date',
						key: 'entityVoucherDate'
					},
					'OffsetAccount': {
						text: 'Offset Account',
						key: 'entityOffsetAccount'
					},
					'PostingNarritive': {
						text: 'Posting Narritive',
						key: 'entityPostingNarritive'
					},
					'Amount': {
						text: 'Amount',
						key: 'entityAmount'
					},
					'AmountOc': {
						text: 'Amount Oc',
						key: 'entityAmountOc'
					},
					'Quantity': {
						text: 'Quantity',
						key: 'entityQuantity'
					},
					'ControllingUnitCode': {
						text: 'Controlling Unit Code',
						key: 'entityControllingUnitCode'
					},
					'ControllingUnitAssign01': {
						text: 'Controlling Unit Assign 01',
						key: 'entityControllingUnitAssign01'
					},
					'ControllingUnitAssign01Desc': {
						text: 'Controlling Unit Assign 01 Desc',
						key: 'entityControllingUnitAssign01Desc'
					},
					'ControllingUnitAssign02': {
						text: 'Controlling Unit Assign 02',
						key: 'entityControllingUnitAssign02'
					},
					'ControllingUnitAssign02Desc': {
						text: 'Controlling Unit Assign 02 Desc',
						key: 'entityControllingUnitAssign02Desc'
					},
					'ControllingUnitAssign03': {
						text: 'Controlling Unit Assign 03',
						key: 'entityControllingUnitAssign03'
					},
					'ControllingUnitAssign03Desc': {
						text: 'Controlling Unit Assign 03 Desc',
						key: 'entityControllingUnitAssign03Desc'
					},
					'ControllingUnitAssign04': {
						text: 'Controlling Unit Assign 04',
						key: 'entityControllingUnitAssign04'
					},
					'ControllingUnitAssign04Desc': {
						text: 'Controlling Unit Assign 04 Desc',
						key: 'entityControllingUnitAssign04Desc'
					},
					'ControllingUnitAssign05': {
						text: 'Controlling Unit Assign 05',
						key: 'entityControllingUnitAssign05'
					},
					'ControllingUnitAssign05Desc': {
						text: 'Controlling Unit Assign 05 Desc',
						key: 'entityControllingUnitAssign05Desc'
					},
					'ControllingUnitAssign06': {
						text: 'Controlling Unit Assign 06',
						key: 'entityControllingUnitAssign06'
					},
					'ControllingUnitAssign06Desc': {
						text: 'Controlling Unit Assign 06 Desc',
						key: 'entityControllingUnitAssign06Desc'
					},
					'ControllingUnitAssign07': {
						text: 'Controlling Unit Assign 07',
						key: 'entityControllingUnitAssign07'
					},
					'ControllingUnitAssign07Desc': {
						text: 'Controlling Unit Assign 07 Desc',
						key: 'entityControllingUnitAssign07Desc'
					},
					'ControllingUnitAssign08': {
						text: 'Controlling Unit Assign 08',
						key: 'entityControllingUnitAssign08'
					},
					'ControllingUnitAssign08Desc': {
						text: 'Controlling Unit Assign 08 Desc',
						key: 'entityControllingUnitAssign08Desc'
					},
					'ControllingUnitAssign09': {
						text: 'Controlling Unit Assign 09',
						key: 'entityControllingUnitAssign09'
					},
					'ControllingUnitAssign09Desc': {
						text: 'Controlling Unit Assign 09 Desc',
						key: 'entityControllingUnitAssign09Desc'
					},
					'ControllingUnitAssign10': {
						text: 'Controlling Unit Assign 10',
						key: 'entityControllingUnitAssign10'
					},
					'ControllingUnitAssign10Desc': {
						text: 'Controlling Unit Assign 10 Desc',
						key: 'entityControllingUnitAssign10Desc'
					},
				}),
				...prefixAllTranslationKeys('controlling.revrecognition.', {
					'PostingDate': {
						text: 'Posting Date',
						key: 'entityPostingDate'
					},
					'Account': {
						text: 'Account',
						key: 'entityAccount'
					},
					'NominalDimension': {
						text: 'Nominal Dimension',
						key: 'entityNominalDimension'
					},
					'NominalDimension2': {
						text: 'Nominal Dimension 2',
						key: 'entityNominalDimension2'
					},
					'NominalDimension3': {
						text: 'Nominal Dimension 3',
						key: 'entityNominalDimension3'
					},
					'IsCancel': {
						text: 'Is Cancel',
						key: 'transaction.isCancel'
					}
				})
			},
			overloads: {}
		};
	}
}