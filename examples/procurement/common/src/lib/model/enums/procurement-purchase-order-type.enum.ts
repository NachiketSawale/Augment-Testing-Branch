/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Procurement purchase order type
 */
export enum ProcurementPurchaseOrderType {
	/**
	 * purchaseOrder
	 */
	PurchaseOrder= 1,
	/**
	 * callOff
	 */
	CallOff= 2,
	/**
	 * changeOrder
	 */
	ChangeOrder= 3,
	/**
	 * frameworkContract
	 */
	FrameworkContract= 4,
	/**
	 * frameworkContractCallOff
	 */
	FrameworkContractCallOff= 5
}