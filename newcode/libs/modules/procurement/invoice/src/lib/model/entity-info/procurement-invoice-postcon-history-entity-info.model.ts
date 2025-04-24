/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPostConHistoryEntityInfo } from '@libs/basics/shared';
import { ProcurementInvoicePostConHistoryDataService } from '../../services/procurement-invoice-postcon-history-data.service';
import { ProcurementInvoicePostConHistoryBehavior } from '../../behaviors/procurement-invoice-postcon-history-behavior.service';

export const PROCUREMENT_INVOICE_POST_CON_HISTORY_ENTITY_INFO = BasicsSharedPostConHistoryEntityInfo.create({
	permissionUuid: '784f5f9b7b654c49b227bd468e3c16d5',
	formUuid: 'e57bb6e3eb2240f8be55d4e6183c3c4a',
	dataServiceToken: ProcurementInvoicePostConHistoryDataService,
	behaviorGrid: ProcurementInvoicePostConHistoryBehavior,
});