/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IAccrualEntity } from '@libs/sales/interfaces';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
/**
 * Sales Billing Accrual layout service
 */
@Injectable({
	providedIn: 'root',
})
export class SalesBillingAccrualLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IAccrualEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'DateEffective', 'CompanyTransactionFk',
					],
					additionalAttributes:[
						'CompanyTransaction.CompanyTransheaderFk', 
						'CompanyTransaction.Currency', 
						'CompanyTransaction.PostingDate', 
						'CompanyTransaction.DocumentType', 
						'CompanyTransaction.VoucherNumber', 
						'CompanyTransaction.VoucherDate', 
						'CompanyTransaction.Account', 
						'CompanyTransaction.OffsetAccount', 
						'CompanyTransaction.PostingNarritive', 
						'CompanyTransaction.Amount', 
						'CompanyTransaction.AmountOc', 
						'CompanyTransaction.Quantity', 
						'CompanyTransaction.ControllingUnitCode', 
						'CompanyTransaction.ControllingUnitAssign01',
						'CompanyTransaction.ControllingUnitAssign01Desc', 
						'CompanyTransaction.ControllingUnitAssign02', 
						'CompanyTransaction.ControllingUnitAssign02Desc', 
						'CompanyTransaction.ControllingUnitAssign03',
						'CompanyTransaction.ControllingUnitAssign03Desc', 
						'CompanyTransaction.ControllingUnitAssign04', 
						'CompanyTransaction.ControllingUnitAssign04Desc',
						'CompanyTransaction.ControllingUnitAssign05',
						'CompanyTransaction.ControllingUnitAssign05Desc',
						'CompanyTransaction.ControllingUnitAssign06', 
						'CompanyTransaction.ControllingUnitAssign06Desc', 
						'CompanyTransaction.ControllingUnitAssign07', 
						'CompanyTransaction.ControllingUnitAssign07Desc', 
						'CompanyTransaction.ControllingUnitAssign08', 
						'CompanyTransaction.ControllingUnitAssign08Desc',                                 
						'CompanyTransaction.ControllingUnitAssign09', 
						'CompanyTransaction.ControllingUnitAssign09Desc', 
						'CompanyTransaction.ControllingUnitAssign10',
						'CompanyTransaction.ControllingUnitAssign10Desc',
						'CompanyTransaction.OffsetContUnitCode',
						'CompanyTransaction.OffsetContUnitAssign01',
						'CompanyTransaction.OffsetContUnitAssign01Desc',
						'CompanyTransaction.OffsetContUnitAssign02',
						'CompanyTransaction.OffsetContUnitAssign02Desc',
						'CompanyTransaction.OffsetContUnitAssign02',
						'CompanyTransaction.OffsetContUnitAssign02Desc',
						'CompanyTransaction.OffsetContUnitAssign02',
						'CompanyTransaction.OffsetContUnitAssign03Desc',
						'CompanyTransaction.OffsetContUnitAssign03',
						'CompanyTransaction.OffsetContUnitAssign04Desc',
						'CompanyTransaction.OffsetContUnitAssign04',
						'CompanyTransaction.OffsetContUnitAssign05Desc',
						'CompanyTransaction.OffsetContUnitAssign05',
						'CompanyTransaction.OffsetContUnitAssign06Desc',
						'CompanyTransaction.OffsetContUnitAssign06',
						'CompanyTransaction.OffsetContUnitAssign07Desc',
						'CompanyTransaction.OffsetContUnitAssign07',
						'CompanyTransaction.OffsetContUnitAssign08',
						'CompanyTransaction.OffsetContUnitAssign08Desc',
						'CompanyTransaction.OffsetContUnitAssign09',
						'CompanyTransaction.OffsetContUnitAssign09Desc',
						'CompanyTransaction.OffsetContUnitAssign10',
						'CompanyTransaction.OffsetContUnitAssign10Desc',
						'CompanyTransaction.NominalDimension', 
						'CompanyTransaction.TaxCode',
						'CompanyTransaction.PostingArea'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.', {
					'DateEffective':{
						key: 'dateEffective',
						text:'Date Effective'
					},
				}),
				...prefixAllTranslationKeys('sales.wip.', {
					'CompanyTransactionFk':{
						key:'entityCompanyTransactionFk',
						text:'Company Transaction',
					},
				}),
				...prefixAllTranslationKeys('sales.wip.transaction.', {
					'CompanyTransaction.CompanyTransHeader':{
						key:'transHeader',
						text:'Transaction Header',
					},
					'CompanyTransaction.PostingDate': {
						text: 'Posting Date',
						key: 'postingDate'
					},
					'CompanyTransaction.Account': {
						text: 'Account',
						key: 'account'
					},
					'CompanyTransaction.DocumentType': {
						text: 'Document Type',
						key: 'documentType'
					},
					'CompanyTransaction.Currency': {
						text: 'Currency',
						key: 'currency'
					},
					'CompanyTransaction.VoucherNumber': {
						text: 'Voucher Number',
						key: 'voucherNumber'
					},
					'CompanyTransaction.VoucherDate': {
						text: 'Voucher Date',
						key: 'voucherDate'
					},
					'CompanyTransaction.OffsetAccount': {
						text: 'Offset Account',
						key: 'offsetAccount'
					},
					'CompanyTransaction.PostingNarritive': {
						text: 'Posting Narritive',
						key: 'postingNarritive'
					},
					'CompanyTransaction.Amount': {
						text: 'Amount',
						key: 'amount'
					},
					'CompanyTransaction.AmountOc': {
						text: 'Amount Oc',
						key: 'amountOc'
					},
					'CompanyTransaction.Quantity': {
						text: 'Quantity',
						key: 'quantity'
					},
					'CompanyTransaction.ControllingUnitCode': {
						text: 'Controlling Unit Code',
						key: 'controllingUnitCode'
					},
					'CompanyTransaction.ControllingUnitAssign01': {
						text: 'Controlling Unit Assign 01',
						key: 'controllingUnitAssign01'
					},
					'CompanyTransaction.ControllingUnitAssign01Desc': {
						text: 'Controlling Unit Assign 01 Desc',
						key: 'controllingUnitAssign01Desc'
					},
					'CompanyTransaction.ControllingUnitAssign02': {
						text: 'Controlling Unit Assign 02',
						key: 'controllingUnitAssign02'
					},
					'CompanyTransaction.ControllingUnitAssign02Desc': {
						text: 'Controlling Unit Assign 02 Desc',
						key: 'controllingUnitAssign02Desc'
					},
					'CompanyTransaction.ControllingUnitAssign03': {
						text: 'Controlling Unit Assign 03',
						key: 'controllingUnitAssign03'
					},
					'CompanyTransaction.ControllingUnitAssign03Desc': {
						text: 'Controlling Unit Assign 03 Desc',
						key: 'controllingUnitAssign03Desc'
					},
					'CompanyTransaction.ControllingUnitAssign04': {
						text: 'Controlling Unit Assign 04',
						key: 'controllingUnitAssign04'
					},
					'CompanyTransaction.ControllingUnitAssign04Desc': {
						text: 'Controlling Unit Assign 04 Desc',
						key: 'controllingUnitAssign04Desc'
					},
					'CompanyTransaction.ControllingUnitAssign05': {
						text: 'Controlling Unit Assign 05',
						key: 'controllingUnitAssign05'
					},
					'CompanyTransaction.ControllingUnitAssign05Desc': {
						text: 'Controlling Unit Assign 05 Desc',
						key: 'controllingUnitAssign05Desc'
					},
					'CompanyTransaction.ControllingUnitAssign06': {
						text: 'Controlling Unit Assign 06',
						key: 'controllingUnitAssign06'
					},
					'CompanyTransaction.ControllingUnitAssign06Desc': {
						text: 'Controlling Unit Assign 06 Desc',
						key: 'controllingUnitAssign06Desc'
					},
					'CompanyTransaction.ControllingUnitAssign07': {
						text: 'Controlling Unit Assign 07',
						key: 'controllingUnitAssign07'
					},
					'CompanyTransaction.ControllingUnitAssign07Desc': {
						text: 'Controlling Unit Assign 07 Desc',
						key: 'controllingUnitAssign07Desc'
					},
					'CompanyTransaction.ControllingUnitAssign08': {
						text: 'Controlling Unit Assign 08',
						key: 'controllingUnitAssign08'
					},
					'CompanyTransaction.ControllingUnitAssign08Desc': {
						text: 'Controlling Unit Assign 08 Desc',
						key: 'controllingUnitAssign08Desc'
					},
					'CompanyTransaction.ControllingUnitAssign09': {
						text: 'Controlling Unit Assign 09',
						key: 'controllingUnitAssign09'
					},
					'CompanyTransaction.ControllingUnitAssign09Desc': {
						text: 'Controlling Unit Assign 09 Desc',
						key: 'controllingUnitAssign09Desc'
					},
					'CompanyTransaction.ControllingUnitAssign10': {
						text: 'Controlling Unit Assign 10',
						key: 'controllingUnitAssign10'
					},
					'CompanyTransaction.ControllingUnitAssign10Desc': {
						text: 'Controlling Unit Assign 10 Desc',
						key: 'controllingUnitAssign10Desc'
					},
					'CompanyTransaction.OffsetContUnitCode':{
						text:'Offset Controlling Unit Code',
						key:'offsetContUnitCode'
					},
					'CompanyTransaction.OffsetContUnitAssign01':{
						text:'Offset Controlling Unit Assign 01',
						key: 'offsetContUnitAssign01'
					},
					'CompanyTransaction.OffsetContUnitAssign01Desc':{
						text:'Offset Controlling Unit Assign 01 Description',
						key: 'offsetContUnitAssign01Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign02':{
						text:'Offset Controlling Unit Assign 02',
						key: 'offsetContUnitAssign02'
					},
					'CompanyTransaction.OffsetContUnitAssign02Desc':{
						text:'Offset Controlling Unit Assign 02 Description',
						key: 'offsetContUnitAssign02Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign03':{
						text:'Offset Controlling Unit Assign 03',
						key: 'offsetContUnitAssign03'
					},
					'CompanyTransaction.OffsetContUnitAssign03Desc':{
						text:'Offset Controlling Unit Assign 03 Description',
						key: 'offsetContUnitAssign03Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign04':{
						text:'Offset Controlling Unit Assign 04',
						key: 'offsetContUnitAssign04'
					},
					'CompanyTransaction.OffsetContUnitAssign04Desc':{
						text:'Offset Controlling Unit Assign 04 Description',
						key: 'offsetContUnitAssign04Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign05':{
						text:'Offset Controlling Unit Assign 05',
						key: 'offsetContUnitAssign05'
					},
					'CompanyTransaction.OffsetContUnitAssign05Desc':{
						text:'Offset Controlling Unit Assign 05 Description',
						key: 'offsetContUnitAssign05Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign06':{
						text:'Offset Controlling Unit Assign 06',
						key: 'offsetContUnitAssign06'
					},
					'CompanyTransaction.OffsetContUnitAssign06Desc':{
						text:'Offset Controlling Unit Assign 06 Description',
						key: 'offsetContUnitAssign06Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign07':{
						text:'Offset Controlling Unit Assign 07',
						key: 'offsetContUnitAssign07'
					},
					'CompanyTransaction.OffsetContUnitAssign07Desc':{
						text:'Offset Controlling Unit Assign 07 Description',
						key: 'offsetContUnitAssign07Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign08':{
						text:'Offset Controlling Unit Assign 08',
						key: 'offsetContUnitAssign08'
					},
					'CompanyTransaction.OffsetContUnitAssign08Desc':{
						text:'Offset Controlling Unit Assign 08 Description',
						key: 'offsetContUnitAssign08Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign09':{
						text:'Offset Controlling Unit Assign 09',
						key: 'offsetContUnitAssign09'
					},
					'CompanyTransaction.OffsetContUnitAssign09Desc':{
						text:'Offset Controlling Unit Assign 09 Description',
						key: 'offsetContUnitAssign09Desc'
					},
					'CompanyTransaction.OffsetContUnitAssign10':{
						text:'Offset Controlling Unit Assign 10',
						key: 'offsetContUnitAssign01'
					},
					'CompanyTransaction.OffsetContUnitAssign10Desc':{
						text:'Offset Controlling Unit Assign 10 Description',
						key: 'offsetContUnitAssign10Desc'
					},
					'CompanyTransaction.NominalDimension':{
						text:'Nominal Dimension',
						key: 'nominalDimension'
					},
					'CompanyTransaction.TaxCode':{
						text:'Tax Code',
						key:'taxCode'
					},
					'CompanyTransaction.PostingArea':{
						text:'Posting Area',
						key:'postingArea'
					}
				}),
			},
			overloads: {
				DateEffective: {
					readonly: true,
					type: FieldType.DateUtc
				},
				CompanyTransactionFk: {
					readonly: true,                            
				},
				  
			},
		};
	}
}