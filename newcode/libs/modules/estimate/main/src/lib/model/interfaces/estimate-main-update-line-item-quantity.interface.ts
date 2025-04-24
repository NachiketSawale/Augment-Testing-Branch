/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/interfaces';

/**
 * Update Quantity Interface
 */
export interface IEstimateLineItemUpdateQuantity {
	UpdatePlannedQuantityConsiderScurve: boolean;
	EstHeaderFk: number;
	IsCompletePerformance: boolean;
	IsUpdateFQ: boolean;
	LineItems: [];
	ProjectId: number;
	SelectedLineItem: null;
	HintText: string;
	UpdatePlannedQuantity: string;
	UpdateBillingQuantity: string;
	EstimateScope: string;
	SelectedItem: string;
}

/**
 * Interface for Post data
 */
export interface IEstimateUpdateQuantityPostData {
	BillingQuantityFrmBill: boolean;
	ConsiderScurve: boolean;
	IsPes: boolean;
	IsSchedule: boolean;
	IsWip: boolean;
	PlannedQuantityFrmSchedule: boolean;
	EstHeaderFk: number;
	ProjectId: number;
	SelectedLineItem: IEstLineItemEntity[];
	IsCompletePerformance: boolean;
	IsUpdateFQ: boolean;
	LineItems?: IEstLineItemEntity[];
	EstLineItemIds: number[];
}
