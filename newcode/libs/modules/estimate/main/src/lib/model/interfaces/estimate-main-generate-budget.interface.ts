/*
 * Copyright(c) RIB Software GmbH
 */
export interface IGenrateBudget {
	EstHeaderFk?: number | null;
	EstScope?: number | null;
	Factor?: number | null;
	GA?: boolean;
	GC?: boolean;
	budgetFrm?: number;
	LineItemIds: number[];
	ProjectId?: number;
	RP?: boolean;
	SelectedItemId?: number;
	SkipFixedBudgetItems?: boolean;
	AM?: boolean;
	StandardAllowanceOption?: { checked: boolean }[];
	isAtciveStandardAllowance?: boolean;
}

export interface IlocalData {
	estScope?: boolean;
	estFactor?: boolean;
	estbudgetFrm?: boolean;
	skipFixedBudgetItems?: boolean;
}

export interface AllowanceOption {
	checked: boolean;
	value: string;
}
