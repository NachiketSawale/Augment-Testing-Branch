/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonDeliveryscheduleEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageDeliveryScheduleDataService } from '../../services/procurement-package-delivery-schedule-data.service';

export const PROCUREMENT_PACKAGE_DELIVERY_SCHEDULE_ENTITY_INFO = ProcurementCommonDeliveryscheduleEntityInfo.create({
	permissionUuid: '502EBB0D396C4E80BA8A76DA068EC9EE',
	formUuid: '4800DAB2A7CC488BB26C84EAB579C27B',
	dataServiceToken: ProcurementPackageDeliveryScheduleDataService,
});
