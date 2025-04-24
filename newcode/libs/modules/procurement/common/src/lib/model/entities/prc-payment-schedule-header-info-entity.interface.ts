/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Procurement common payment schedule header info entity interface
 */
export interface IPrcCommonPaymentScheduleHeaderInfoEntity {
	TotalNetOc: number,
	TotalGrossOc: number,
	PaymentScheduleNetOc: number,
	PaymentScheduleGrossOc: number,
	VarianceNetOc: number,
	VarianceGrossOc: number
}