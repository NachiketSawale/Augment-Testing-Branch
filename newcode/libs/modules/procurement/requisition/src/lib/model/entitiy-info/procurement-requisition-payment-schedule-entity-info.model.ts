/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementRequisitionPaymentScheduleDataService } from '../../services/procurement-requisition-payment-schedule-data.service';
import { ProcurementRequisitionPaymentScheduleBehaviorService } from '../../behaviors/procurement-requisition-payment-schedule-behavior.service';
import { ProcurementRequisitionPaymentScheduleValidationService } from '../../services/validations/procurement-requisition-payment-schedule-validation.service';
import { ProcurementCommonPaymentScheduleEntityInfo } from '@libs/procurement/common';


/**
 * procurement package payment schedule Module Info
 */
export const PROCUREMENT_REQUISITION_PAYMENT_SCHEDULE_ENTITY_INFO = ProcurementCommonPaymentScheduleEntityInfo.create({
	permissionUuid: '423730D7024B4D8BABE269DDA3790B59',
	formUuid: '7A7709EEFC9A4489B7EE00A0B8EB0781',
	behaviorToken: ProcurementRequisitionPaymentScheduleBehaviorService,
	dataServiceToken: ProcurementRequisitionPaymentScheduleDataService,
	validationServiceToken: ProcurementRequisitionPaymentScheduleValidationService,
});
