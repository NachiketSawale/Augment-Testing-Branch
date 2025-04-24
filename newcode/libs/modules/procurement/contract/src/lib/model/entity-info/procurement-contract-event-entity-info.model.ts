/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonEventsEntityInfo } from '@libs/procurement/common';
import { ProcurementContractEventsDataService } from '../../services/procurement-contract-events-data.service';

export const PROCUREMENT_CONTRACT_EVENTS_ENTITY_INFO = ProcurementCommonEventsEntityInfo.create({
	containerUuid: '7879859fdbd94c1ca3462c7919b7bc6e',
	permissionUuid: '07946cb829634366b34547b3c5987b23',
	formUuid: '27b072c4d6074bf9938718b79d95c967',
	dataServiceToken: ProcurementContractEventsDataService,
});
