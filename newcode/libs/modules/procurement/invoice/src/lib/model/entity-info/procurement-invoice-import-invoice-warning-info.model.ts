/*
 * Copyright(c) RIB Software GmbH
 */
import { ContainerDefinition } from '@libs/ui/container-system';
import { ImportInvoiceWarningComponent } from '../../components/import-invoice-warning/import-invoice-warning.component';

/**
 * Procurement Invoice Import invoice warning Entity Info
 */
export const PROCUREMENT_INVOICE_IMPORT_INVOICE_WARNING_INFO:ContainerDefinition = new ContainerDefinition({
    id:'prc.inv.import.warning.grid',
    containerType:ImportInvoiceWarningComponent,
    uuid:'fc8e5673b0fc41fb972dea9110c8f986',
    title:'procurement.invoice.title.importInvoiceWarningTitle'
});