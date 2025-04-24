/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICustomizeDialogConfigOptions{
	contextId: number,
	editType : string,// estimate || customizeforcolumn customizefortotals customizeforstructure customizeforupp
	columnConfigTypeId?:number | null,
	totalsConfigTypeId?:number | null,
	structureConfigTypeId?:number | null,
	uppConfigTypeId?:number | null,
	costBudgetConfigTypeId?:number | null,
	columnConfigFk?:number | null,
	totalsConfigFk?:number | null,
	structureConfigFk?:number | null,
	uppConfigFk?:number | null,
	costBudgetConfigFk?:number | null,
	isInUse : boolean,
	configFk : number | null,
	configTypeId: number | null
}