/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementPackagePaymentScheduleDataService } from '../../services/procurement-package-payment-schedule-data.service';
import { ProcurementPackagePaymentScheduleBehaviorService } from '../../behaviors/procurement-package-payment-schedule-behavior.service';
import { ProcurementPackagePaymentScheduleValidationService } from '../../services/validations/procurement-package-payment-schedule-validation.service';
import { ProcurementCommonPaymentScheduleEntityInfo } from '@libs/procurement/common';


/**
 * procurement package payment schedule Module Info
 */
export const PROCUREMENT_PACKAGE_PAYMENT_SCHEDULE_ENTITY_INFO = ProcurementCommonPaymentScheduleEntityInfo.create({
	permissionUuid: '3F5E1709104C407EA503562029609DFD',
	formUuid: 'AFB82D25D24442228408B32350839C22',
	behaviorToken: ProcurementPackagePaymentScheduleBehaviorService,
	dataServiceToken: ProcurementPackagePaymentScheduleDataService,
	validationServiceToken: ProcurementPackagePaymentScheduleValidationService,
});
