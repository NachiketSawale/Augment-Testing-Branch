/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IInvRejectEntity } from '../entities';
import { ProcurementInvoiceRejectionDataService } from '../../services/procurement-invoice-rejection-data.service';
import { ProcurementInvoiceRejectionLayoutService } from '../../services/layouts/procurement-invoice-rejection-layout.service';
import { ProcurementInvoiceRejectionValidationService } from '../../services/validations/procurement-invoice-rejection-validation.service';

export const PROCUREMENT_INVOICE_REJECTION_ENTITY_INFO = EntityInfo.create<IInvRejectEntity>({
	grid: {
		title: {text: 'Rejections', key: 'procurement.invoice.title.rejection'},
	},
	form: {
		containerUuid: 'b7f11367557442528540ff73850b8a1e',
		title: {
			key: 'procurement.invoice.title.rejectionDetail',
		},
	},
	dataService: (ctx) => ctx.injector.get(ProcurementInvoiceRejectionDataService),
	validationService: ctx => ctx.injector.get(ProcurementInvoiceRejectionValidationService),
	dtoSchemeId: {moduleSubModule: 'Procurement.Invoice', typeName: 'InvRejectDto'},
	permissionUuid: 'b5ea8b9cae134b96a91fe364b4012121',
	layoutConfiguration: async (context) => {
		return context.injector.get(ProcurementInvoiceRejectionLayoutService).generateLayout(context);
	},
});
