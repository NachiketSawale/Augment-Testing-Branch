/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IInv2PESEntity } from '../entities';
import { ProcurementInvoicePesDataService } from '../../services/procurement-invoice-pes-data.service';
import { ProcurementInvoicePesLayoutService } from '../../services/layouts/procurement-invoice-pes-layout.service';
import { ProcurementInvoiceOtherValidationService } from '../../services/procurement-invoice-pes-validation.service';

export const PROCUREMENT_INVOICE_PES_ENTITY_INFO = EntityInfo.create<IInv2PESEntity>({
	grid: {
		title: {text: 'Performance Entry Sheets', key: 'procurement.invoice.title.pes'},
	},
	form: {
		containerUuid: '1fc9c49861644f4abb0f83e6ed6fd76a',
		title: {text: 'Performance Entry Sheet Detail', key: 'procurement.invoice.title.pesDetail'},
	},
	dataService: (ctx) => ctx.injector.get(ProcurementInvoicePesDataService),
	dtoSchemeId: {moduleSubModule: 'Procurement.Invoice', typeName: 'Inv2PESDto'},
	permissionUuid: 'ab72d4bed5ba408bbb77b429e8a462ef',
	layoutConfiguration: async (context) => {
		return context.injector.get(ProcurementInvoicePesLayoutService).generateLayout();
	},
	validationService: (ctx) => ctx.injector.get(ProcurementInvoiceOtherValidationService),
});
