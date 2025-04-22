/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';

/**
 * Entity info for procurement Invoice characteristic
 */
export const PROCUREMENT_INVOICE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '771d062f8d634ed6a33b897752fb7b16',
	sectionId: BasicsCharacteristicSection.ProcurementInvoice,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementInvoiceHeaderDataService);
	},	
},);