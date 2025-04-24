import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

export interface SalesContractPaymentScheduleInterface{
	hasTotalSetting: boolean;
	itsMainOrderIsBilled: boolean;
	paymentScheduleGrossOc: number;
	paymentScheduleNetOc:number;
	Main: IOrdPaymentScheduleEntity[]
}