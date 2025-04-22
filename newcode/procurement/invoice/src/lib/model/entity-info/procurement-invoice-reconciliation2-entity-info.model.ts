/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerDefinition } from '@libs/ui/container-system';
import { ProcurementInvoiceReconciliation2Component } from '../../components/procurement-invoice-reconciliation2/procurement-invoice-reconciliation2.component';
/**
 * represent procurement invoice reconciliation2 entity info
 */
export const PROCUREMENT_INVOICE_RECONCILIATION2_ENTITY_INFO: ContainerDefinition = new ContainerDefinition({
    id:'prc.inv.reconciliation2.grid',
    containerType:ProcurementInvoiceReconciliation2Component,
    uuid:'0e14d4c48df94e85b816119c2f95f20b',
    title:'procurement.invoice.title.reconciliation2',
});