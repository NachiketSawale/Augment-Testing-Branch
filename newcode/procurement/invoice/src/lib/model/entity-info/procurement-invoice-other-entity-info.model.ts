/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IInvOtherEntity } from '../entities';
import { ProcurementInvoiceOtherLayoutService } from '../../services/layouts/procurement-invoice-other-layout.service';
import { ProcurementInvoiceOtherDataService } from '../../services/procurement-invoice-other-data.service';
import { ProcurementInvoiceOtherValidationService } from '../../services/procurement-invoice-other-validation.service';

export const PROCUREMENT_INVOICE_OTHER_ENTITY_INFO = EntityInfo.create<IInvOtherEntity>({
	grid: {
		title: {text: 'Other Services', key: 'procurement.invoice.title.other'},
	},
	dataService: (ctx) => ctx.injector.get(ProcurementInvoiceOtherDataService),
	dtoSchemeId: {moduleSubModule: 'Procurement.Invoice', typeName: 'InvOtherDto'},
	permissionUuid: '4cf775eb68064cd5ad1f75e38affe41f',
	layoutConfiguration: async (context) => {
		return context.injector.get(ProcurementInvoiceOtherLayoutService).generateLayout(context);
	},
	validationService: (ctx) => ctx.injector.get(ProcurementInvoiceOtherValidationService)
});
