/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

/**
 * Payment schedule base entity interface
 */
export interface IPaymentScheduleBaseEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DatePayment?: string | null;
	DateRequest: string;
	PercentOfContract: number;
	AmountNet: number;
	AmountNetOc: number;
	AmountGross: number;
	AmountGrossOc: number;
	CommentText?: string | null;
	PsdActivityFk?: number | null;
	PsdScheduleFk?: number | null;
	BasPaymentTermFk?: number | null;
	PaymentVersion?: string | null;
	MeasuredPerformance: number;
	IsLive: boolean;
	IsDone: boolean;
	IsTotal: boolean;
	Sorting: number;
	Remaining: number;
	RemainingOc: number;
}