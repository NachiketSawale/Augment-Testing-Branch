import { SALES_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN } from '../behaviors/sales-contract-payment-schedule-behavior.service';
import { SALES_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN } from '../services/sales-contract-payment-schedule-data.service';
import {
	SalesContractCommonPaymentScheduleEntityInfo
} from './entity-info/sales-contract-payment-schedule-entity-info.model';

export const SALES_CONTRACT_PAYMENT_SCHEDULE_ENTITY_INFO = SalesContractCommonPaymentScheduleEntityInfo.create({
	permissionUuid: 'a958c52e47c349eca3e930ec279545ce',
	formUuid: '780a0f1ba7a942c2a3fd885caacd826a',
	behaviorToken: SALES_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN,
	dataServiceToken: SALES_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN
});