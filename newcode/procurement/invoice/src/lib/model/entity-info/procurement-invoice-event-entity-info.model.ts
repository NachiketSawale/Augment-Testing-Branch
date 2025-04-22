/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonEventsEntityInfo } from '@libs/procurement/common';
import { ProcurementInvoiceEventDataService } from '../../services/procurement-invoice-event-data.service';

export const PROCUREMENT_INVOICE_EVENT_ENTITY_INFO=ProcurementCommonEventsEntityInfo.create({
	containerUuid:'266ff910eae74df78496a1f0e0d08484',
	permissionUuid: '07946cb829634366b34547b3c5987b23',
	formUuid: 'c68a5427a8cb44609111be17f0b95f34',
	dataServiceToken: ProcurementInvoiceEventDataService,
});