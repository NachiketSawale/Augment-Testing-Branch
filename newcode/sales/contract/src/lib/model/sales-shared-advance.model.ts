import { IOrdAdvanceEntity, IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

export interface SalesSharedAdvanceModel{
	Main: IOrdAdvanceEntity[];
}

export interface SalesSharedPaymentScheduleModel{
	Main: IOrdPaymentScheduleEntity[];
}