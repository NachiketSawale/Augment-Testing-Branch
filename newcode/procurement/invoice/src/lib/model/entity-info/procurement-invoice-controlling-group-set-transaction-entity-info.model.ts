/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingSharedGroupSetEntityInfo } from '@libs/controlling/shared';
import { ProcurementInvoiceTransactionDataService } from '../../services/procurement-invoice-transaction-data.service';

export const PROCUREMENT_INVOICE_CONTROLLING_GROUP_TRANSACTION_SET_ENTITY_INFO = ControllingSharedGroupSetEntityInfo.create({
	permissionUuid: '3b9381545d4c48019f8f409241e7d533',
	grid: {title: {text: 'Controlling Group Set By Transactions', key: 'procurement.invoice.title.InvGrpSetDTLByTransactionsGridTitle'}},
	form: {
		containerUuid: 'a2b4c694e5d14bfe970d5527bcbb627c',
		title: {text: 'Controlling Group Set Details By Transactions', key: 'procurement.invoice.title.InvGrpSetDTLByTransactionsFormTitle'},
	},
	parentService: ProcurementInvoiceTransactionDataService
});
