/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateUpdateRevenue {
	EstHeaderId?: number;
	ProjectId?: number;
	SelectedItemId?: number;
	IsDistributeByCost?: boolean;
	IsUpdateByWipQuantity?: boolean;
	selectedLevel?: string;
	DistributeBy?: number;
}