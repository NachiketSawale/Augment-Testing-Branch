/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { InvComplete } from '../inv-complete.class';
import { IInvHeaderEntity } from '../entities/inv-header-entity.interface';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';

/**
 * Procurement Invoice Form Data Entity Info
 */
export const PROCUREMENT_INVOICE_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IInvHeaderEntity, InvComplete>({
	rubric: Rubric.Invoices,
	permissionUuid: '2f475527c2854daeb00a286480b4fb77',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementInvoiceHeaderDataService);
	},
});