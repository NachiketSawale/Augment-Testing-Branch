/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingSharedGroupSetEntityInfo } from '@libs/controlling/shared';
import { ProcurementInvoiceOtherDataService } from '../../services/procurement-invoice-other-data.service';


export const PROCUREMENT_INVOICE_CONTROLLING_GROUP_OTHER_SET_ENTITY_INFO = ControllingSharedGroupSetEntityInfo.create({
	permissionUuid: '73e4bc3f65a2414b96b4abc62af286fa',
	grid: {title: {text: 'Controlling Group Set By Other', key: 'procurement.invoice.title.InvGrpSetDTLByOtherGridTitle'}},
	form: {
		containerUuid: 'a2b4c694e5d14bfe970d5527bcbb627c',
		title: {text: 'Controlling Group Set Details By Other', key: 'procurement.invoice.title.InvGrpSetDTLByOtherFormTitle'},
	},
	parentService: ProcurementInvoiceOtherDataService,
});
