/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonDeliveryscheduleEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteDeliveryScheduleDataService } from '../../services/procurement-quote-deliveryschedule-data.service';

/**
 * Procurement quote delivery schedule Entity Info
 */
export const PROCUREMENT_QUOTE_DELIVERYSCHEDULE_ENTITY_INFO = ProcurementCommonDeliveryscheduleEntityInfo.create({
    permissionUuid: '5369b79f3a204fa5a7470ac88a6c2da5',
    formUuid: '2bc860d66cb442dc9f376f4d9c954047',
    dataServiceToken: ProcurementQuoteDeliveryScheduleDataService,
});