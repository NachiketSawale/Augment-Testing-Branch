/*
 * Copyright(c) RIB Software GmbH
 */
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Payment Term Entity
 */
export interface IPaymentTermEntity extends IEntityBase {
	Id: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	NetDays: number;
	DiscountPercent?: number | null;
	DayOfMonth: number;
	PrintDescriptionInfo?: IDescriptionInfo;
	PrintTextDescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Codefinance?: string;
	IsDateInvoiced: boolean;
	IsLive: boolean;
	CalculationTypeFk: number;
	Month: number;
	IsDefaultCreditor: boolean;
	IsDefaultDebtor: boolean;
	DiscountDays: number;
}
