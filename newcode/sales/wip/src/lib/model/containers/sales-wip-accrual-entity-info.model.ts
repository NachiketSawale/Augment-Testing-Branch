/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IWipAccrualEntity } from '../entities/wip-accrual-entity.interface';
import { SalesInvoiceAccrualDataService } from '../../services/sales-invoice-accrual-data.service';
import { FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Entity info for basics billing schema
 */
export const SALES_WIP_ACCRUAL_ENTITY_INFO: EntityInfo = EntityInfo.create<IWipAccrualEntity> ({
	grid: {
		title: {key: 'sales.wip.containerTitleAccrual'}
	},
	dataService: ctx => ctx.injector.get(SalesInvoiceAccrualDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Wip', typeName: 'WipAccrualDto'},
	permissionUuid: '970510ed79f444d5a1ab579c4da4871d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data',
				attributes: [
					'CompanyTransactionFk','DateEffective', 'WipHeaderEntity', 'WipHeaderFk','CompanyTransheaderFk',
					'PostingDate','VoucherNumber','VoucherDate','Account','OffsetAccount','OffsetContUnitCode',
					'ControllingUnitAssign01','ControllingUnitCode'
				]
			},
		],
		overloads: {
			DateEffective: {readonly: true, type: FieldType.DateUtc },
			CompanyTransactionFk: {readonly: true},
			CompanyTransheaderFk:{type: FieldType.Description},
			PostingDate:{type: FieldType.Description},
			VoucherNumber:{type: FieldType.Description},
			VoucherDate:{type: FieldType.Description},
			Account:{type: FieldType.Description},
			OffsetAccount:{type: FieldType.Description},
			OffsetContUnitCode:{type: FieldType.Description},
			ControllingUnitAssign01:{type: FieldType.Description},
			ControllingUnitCode:{type: FieldType.Description},
		},
		labels: {
			...prefixAllTranslationKeys('sales.wip.', {
				CompanyTransactionFk: {key: 'entityCompanyTransactionFk'},
				DateEffective: {key: 'entityDateEffective'},
			}),
			...prefixAllTranslationKeys('procurement.pes.transaction.', {
				CompanyTransheaderFk:{key: 'transHeader'},
				PostingDate:{key: 'postingDate'},
				VoucherNumber:{key: 'voucherNumber'},
				VoucherDate:{key: 'voucherDate'},
				Account:{key: 'account'},
				OffsetAccount:{key: 'offsetAccount'},
				OffsetContUnitCode:{key: 'offsetContUnitCode'},
				ControllingUnitAssign01:{key: 'controllingUnitAssign01'},
				ControllingUnitCode:{key: 'controllingUnitCode'},
			})
		},
	}
});