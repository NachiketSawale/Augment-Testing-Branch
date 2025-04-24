import { InjectionToken } from '@angular/core';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

export interface  ISalesContractMainPaymentScheduleVersion{
	Id:number,
	Version:string,
	TotalNet:number,
	TotalGross:number,
	From:Date,
	End:Date,
}

export interface ISalesContractMainPaymentScheduleVersionOption{
	paymentScheduleVersions:ISalesContractMainPaymentScheduleVersion[],
	mainItemId:number
}

export interface  ISalesContractMainPaymentScheduleVersionCreateHttpResponse{
	PaymentSchedules:IOrdPaymentScheduleEntity[],
	VersionInfo:ISalesContractMainPaymentScheduleVersion
}

export interface  ISalesContractMaintainPaymentScheduleVersionResult {
	createItems: IOrdPaymentScheduleEntity[],
	mainItemId: number,
	versionInfos: ISalesContractMainPaymentScheduleVersion[]
}

export const MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS = new InjectionToken<ISalesContractMainPaymentScheduleVersionOption>('GENERATE_DELIVERY_SCHEDULE_DIALOG_OPTIONS');
