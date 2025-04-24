/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { IPrcPaymentScheduleEntity } from '../../entities';


export interface  IProcurementCommonMainPaymentScheduleVersion{
	Id:number,
	Version:string,
	TotalNet:number,
	TotalGross:number,
	From:Date,
	End:Date,
}

export interface IProcurementCommonMainPaymentScheduleVersionOption{
	paymentScheduleVersions:IProcurementCommonMainPaymentScheduleVersion[],
	mainItemId:number
}

export interface  IProcurementCommonMainPaymentScheduleVersionCreateHttpResponse{
	PaymentSchedules:IPrcPaymentScheduleEntity[],
	VersionInfo:IProcurementCommonMainPaymentScheduleVersion
}

export interface  IProcurementCommonMaintainPaymentScheduleVersionResult {
	createItems: IPrcPaymentScheduleEntity[],
	mainItemId: number,
	versionInfos: IProcurementCommonMainPaymentScheduleVersion[]
}

export const MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS = new InjectionToken<IProcurementCommonMainPaymentScheduleVersionOption>('GENERATE_DELIVERY_SCHEDULE_DIALOG_OPTIONS');
