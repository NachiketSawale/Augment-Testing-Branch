/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICostCodeAssignmentDetailDataService {
	setEntitiesByTotalsConfigDetailId(totalsConfigDetailId: number): void;
	copyItemsByTotalsConfigDetailId(totalsConfigDetailId: number): void;
}