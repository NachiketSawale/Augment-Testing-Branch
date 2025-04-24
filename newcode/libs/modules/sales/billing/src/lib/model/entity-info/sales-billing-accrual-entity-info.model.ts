/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { EntityDomainType } from '@libs/platform/data-access';
import { IAccrualEntity } from '@libs/sales/interfaces';
import { SalesBillingAccrualBehavior } from '../../behaviors/sales-billing-accrual-behavior.service';
import { SalesBillingAccrualDataService } from '../../services/sales-billing-accrual-data.service';
import { SalesBillingAccrualLayoutService } from '../../services/sales-billing-accrual-layout.service';
/**
 * Represent Sales Billing Accrual Entity Info
 */
export const SALES_BILLING_ACCRUAL_ENTITY_INFO: EntityInfo = EntityInfo.create<IAccrualEntity>({
	grid: {
		title: { key: 'sales.billing.containerTitleAccrual' },
		behavior: (ctx) => ctx.injector.get(SalesBillingAccrualBehavior),
        containerUuid:'cbf9b7eea34d471884ddf50512193599'
	},
	dataService: (ctx) => ctx.injector.get(SalesBillingAccrualDataService),
	dtoSchemeId: { moduleSubModule: 'Sales.Billing', typeName: 'AccrualDto' },
	permissionUuid: '1bf50a240bd14d018fd2477237611197',
	entitySchema: {
        schema: 'IAccrualEntity',
        properties: {
          DateEffective: { domain: EntityDomainType.Date, mandatory: true },
          CompanyTransactionFk: { domain: EntityDomainType.Description, mandatory: true },
        },
        additionalProperties: {
            'CompanyTransaction.CompanyTransheaderFk': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.Currency': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.PostingDate': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.DocumentType': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.VoucherNumber': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.VoucherDate': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.Account': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetAccount': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.PostingNarritive': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.Amount': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.AmountOc': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.Quantity': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.ControllingUnitCode': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign01': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign01Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign02': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign02Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign03': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign03Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign04': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign04Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign05': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign05Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign06': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign06Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign07': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign07Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign08': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign08Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign09': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign09Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign10': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign10Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitCode': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign01': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign01Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign02': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign02Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign03': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign03Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign04': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign04Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign05': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign05Desc': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign06': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign06Desc': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign07': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign07Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign08': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign08Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign09': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign09Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign10': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign10Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.NominalDimension': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.TaxCode': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.PostingArea': { domain: EntityDomainType.Integer, mandatory: false },
        },
        mainModule: 'Sales.Billing',
      },
	layoutConfiguration: context => {
		return context.injector.get(SalesBillingAccrualLayoutService).generateLayout();
	}
});