/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IInvHeader2InvHeaderEntity } from '../entities';
import { ProcurementInvoiceChainedInvoiceDataService } from '../../services/procurement-invoice-chained-invoice-data.service';
import { ProcurementInvoiceChainedInvoiceLayoutService } from '../../services/layouts/procurement-invoice-chained-invoice-layout.service';

export const PROCUREMENT_INVOICE_CHAINED_INVOICE_ENTITY_INFO = EntityInfo.create<IInvHeader2InvHeaderEntity>({
	grid: {
		title: { text: 'Chained Invoices', key: 'procurement.invoice.title.header2header' },
	},
	dataService: (ctx) => ctx.injector.get(ProcurementInvoiceChainedInvoiceDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Invoice', typeName: 'InvHeader2InvHeaderDto' },
	permissionUuid: '5f8dcfed83324bbeb9704576b94651fc',
	layoutConfiguration: async (context) => {
		return context.injector.get(ProcurementInvoiceChainedInvoiceLayoutService).generateLayout();
	},
});
