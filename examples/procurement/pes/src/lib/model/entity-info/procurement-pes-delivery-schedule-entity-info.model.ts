/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonDeliveryscheduleEntityInfo } from '@libs/procurement/common';
import { ProcurementPesDeliveryScheduleDataService } from '../../services/procurement-pes-delivery-schedule-data.service';
import { ProcurementPesDeliveryScheduleGridBehavior } from '../../behaviors/procurement-pes-delivery-schedule-grid-behavior.service';
import { ProcurementPesDeliveryScheduleFormBehavior } from '../../behaviors/procurement-pes-delivery-schedule-form-behavior.service';

export const PROCUREMENT_PES_DELIVERY_SCHEDULE_ENTITY_INFO = ProcurementCommonDeliveryscheduleEntityInfo.create({
	permissionUuid: '6fcb9c09fbf54d43a219cc277db84695',
	formUuid: '6987efb71ded4076926e9f5f73a25b4c',
	dataServiceToken: ProcurementPesDeliveryScheduleDataService,
	behaviorGrid:ProcurementPesDeliveryScheduleGridBehavior,
	behaviorForm:ProcurementPesDeliveryScheduleFormBehavior
});