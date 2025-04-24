/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonEventsEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteEventsDataService } from '../../services/procurement-quote-events-data.service';

/**
 * Procurement Quote procurement event entity info model
 */
export const PROCUREMENT_QUOTE_EVENT_ENTITY_INFO=ProcurementCommonEventsEntityInfo.create({
	containerUuid:'5AE32129FFCF4552A5B0F65207BD0B30',
	permissionUuid: '07946CB829634366B34547B3C5987B23',
	formUuid: '6a38335956c94ae3a6ecb654961f79c0',
	dataServiceToken: ProcurementQuoteEventsDataService,
});