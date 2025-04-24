/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonPaymentScheduleEntityInfo } from '@libs/procurement/common';
import { PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN } from '../../services/procurement-contract-payment-schedule-data.service';
import { PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN } from '../../behaviors/procurement-contract-payment-schedule-behavior.service';
import { PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_VALIDATION_TOKEN } from '../../services/procurement-contract-payment-schedule-validation.service';

/**
 * procurement contract payment schedule Module Info
 */
export const PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_ENTITY_INFO = ProcurementCommonPaymentScheduleEntityInfo.create({
	permissionUuid: '0613476f0a9a4a87ba62f830fff99c7d',
	formUuid: '6e93fb1d19e841d190f240c0013e164d',
	behaviorToken: PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN,
	dataServiceToken: PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN,
	validationServiceToken: PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_VALIDATION_TOKEN
});