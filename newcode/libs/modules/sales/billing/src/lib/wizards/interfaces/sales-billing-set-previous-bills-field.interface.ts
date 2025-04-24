/*
 * Copyright(c) RIB Software GmbH
 */

export interface ISalesBillingSetPreviousBillFields {

	/**
     * BillId
     */
	BillId: number;

	/**
     * PreviousBillId
     */
	PreviousBillId?: number | null;

	/**
     * OrdHeaderId
     */
	OrdHeaderId?: number | null;

	/**
     * ProjectId
     */
	ProjectId: number;	

	/**
     * PreviousBillDescription
     */
	DescriptionInfo?: string | null;
}
