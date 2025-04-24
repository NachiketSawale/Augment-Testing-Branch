export type BasicsSharedCashFlowProjection = {
	CashProjectionFk?: number;
	ScurveFk: number | null;
	TotalCost: number | null;
	StartWork: Date | string | null;
	EndWork: Date | string | null;
	OnlyLinearAdjustment: boolean;
};
