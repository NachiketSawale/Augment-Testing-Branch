/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * ILineItemQuantityMaintenanceEntity is the interface use for line item quantity maintenance wizard dialog
 */
export interface ILineItemQuantityMaintenanceEntity {
	Date: Date;
	Factor: number;
	TargetQuantityTypeId: number;
	SourceQuantityTypeId: number;
	EstimateScope: number;
}
