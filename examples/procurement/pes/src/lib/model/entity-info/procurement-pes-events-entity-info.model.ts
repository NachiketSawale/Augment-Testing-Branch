/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonEventsEntityInfo } from '@libs/procurement/common';
import { ProcurementPesEventsDataService } from '../../services/procurement-pes-events-data.service';

export const PROCUREMENT_PES_EVENTS_ENTITY_INFO =ProcurementCommonEventsEntityInfo.create({
	containerUuid:'09d5678937f44572b382680019d9b535',
	permissionUuid: '07946cb829634366b34547b3c5987b23',
	formUuid: '27b072c4d6074bf9938718b79d95c967',
	dataServiceToken: ProcurementPesEventsDataService,
});
