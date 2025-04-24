/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonDeliveryscheduleEntityInfo } from '@libs/procurement/common';
import { ProcurementRequisitionDeliveryScheduleDataService } from '../../services/procurement-requisition-delivery-schedule-data.service';

export const PROCUREMENT_REQUISITION_DELIVERY_SCHEDULE_ENTITY_INFO = ProcurementCommonDeliveryscheduleEntityInfo.create({
	permissionUuid: 'A3F91320A8ED4A56BC711537A31F1A2A',
	formUuid: '862C6FFCAC5B41B299EF2F1131F95636',
	dataServiceToken: ProcurementRequisitionDeliveryScheduleDataService,
});
