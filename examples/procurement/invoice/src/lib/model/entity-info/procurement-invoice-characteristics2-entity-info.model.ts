/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';


/**
 * Entity info for procurement Invoice characteristic 2
 */
export const PROCUREMENT_INVOICE_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '9ca2525bb81e47eba6582eea65990b1b',
	sectionId: BasicsCharacteristicSection.InvoiceCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementInvoiceHeaderDataService);
	}
});