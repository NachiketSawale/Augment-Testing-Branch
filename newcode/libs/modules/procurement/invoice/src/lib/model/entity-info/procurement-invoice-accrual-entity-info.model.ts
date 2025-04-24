/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementInvoiceAccrualGridDataService } from '../../services/procurement-invoice-accrual-grid-data.service';
import { ProcurementCommonAccrualEntityInfoFactoryService } from '@libs/procurement/common';
 
/**
 * Procurement Invoice Accrual Entity.
 */
export const PROCUREMENT_INVOICE_ACCRUAL_ENTITY_INFO = ProcurementCommonAccrualEntityInfoFactoryService.create({
  gridTitle: {
    key: 'procurement.invoice.accrualGridContainerTitle',
  },
  formTitle: {
    key: 'procurement.invoice.accrualDetailContainerTitle',
  },
  containerUuid: 'c4023caaf11e4af88a466716067e6c77',
  permissionUuid: '661feba708a946f485186e2b61a7338e',
  dataService: ProcurementInvoiceAccrualGridDataService,
  dtoSchemeId: { moduleSubModule: ProcurementModule.Invoice, typeName: 'InvAccrualDto' },
  schema: 'IInvoiceAccrualEntity',
  mainModule: 'Procurement.Invoice',
});