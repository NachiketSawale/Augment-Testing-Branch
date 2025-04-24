/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingSharedGroupSetEntityInfo } from '@libs/controlling/shared';
import { ProcurementInvoiceRejectionDataService } from '../../services/procurement-invoice-rejection-data.service';

export const PROCUREMENT_INVOICE_CONTROLLING_GROUP_REJECTION_SET_ENTITY_INFO = ControllingSharedGroupSetEntityInfo.create({
	permissionUuid: 'e7d3f773133a462d89cae482d1f7e531',
	grid: {title: {text: 'Controlling Group Set By Rejection', key: 'procurement.invoice.title.InvGrpSetDTLByRejectionGridTitle'}},
	form: {
		containerUuid: 'a2b4c694e5d14bfe970d5527bcbb627c',
		title: {text: 'Controlling Group Set Details By Rejection', key: 'procurement.invoice.title.InvGrpSetDTLByRejectionFormTitle'},
	},
	parentService: ProcurementInvoiceRejectionDataService
});
