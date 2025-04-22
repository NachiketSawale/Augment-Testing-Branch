/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonEventsEntityInfo } from '@libs/procurement/common';
import { ProcurementRequisitionEventDataService } from '../../services/procurement-requisition-event-data.service';

export const PROCUREMENT_REQUISITION_EVENT_ENTITY_INFO=ProcurementCommonEventsEntityInfo.create({
	containerUuid:'CCCFBB09280A46E2B7707AC5C566AF61',
	permissionUuid: '07946CB829634366B34547B3C5987B23',
	formUuid: '8504b4a192fe42e4bd7dac7338e8e01a',
	dataServiceToken: ProcurementRequisitionEventDataService,
});