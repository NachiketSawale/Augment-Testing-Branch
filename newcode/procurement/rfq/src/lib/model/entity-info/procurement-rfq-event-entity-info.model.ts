/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonEventsEntityInfo } from '@libs/procurement/common';
import { ProcurementRfqEventDataService } from '../../services/procurement-rfq-event-data.service';

export const PROCUREMENT_RFQ_EVENT_ENTITY_INFO=ProcurementCommonEventsEntityInfo.create({
	containerUuid:'A9920C855D49423ABE4F8EBA30ADBB7A',
	permissionUuid: '07946CB829634366B34547B3C5987B23',
	formUuid: 'bda657aee53149f58291611402552cec',
	dataServiceToken: ProcurementRfqEventDataService,
});