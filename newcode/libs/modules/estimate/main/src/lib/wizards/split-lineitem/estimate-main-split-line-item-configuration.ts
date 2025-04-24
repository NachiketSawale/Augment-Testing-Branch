/*
 * Copyright(c) RIB Software GmbH
 */

export interface ISplitLineItems {
	Id?: number;
	info?: string | null;
	code?: string;
	desc?: string;
	quantityPercent?: number
	quantityTotal?: number;
	splitDifference?: number | null;
	estLineItemFk?: number | null;
	mdcControllingUnitfk?: number | null;
	boqRootRef?: number | null;
	EstBoqFk?: number | null;
	psdActivityScheduleFk?: number | null;
	psdActivityFk?: number | null;
	prjLocationFk?: number | null;
	isMainItem?: boolean;
}

export class SplitLineItemMethodsForm {
	public resultSet?: number;
	public splitMethod?: number;
	public _splitMethod?: number;
}

export class SplitByResourcesForm {
	public splitByResourcesOptions?: number;
}

export class SplitByQuantityForm {
	public doSplitAsReference?: boolean;
	public splitLineItems?: ISplitLineItems[];
	public applySplitResultTo?: string;
	public noRelation?: boolean;
}

export class SplitLineItemConfiguration {
	public splitLineItemMethodsForm = new SplitLineItemMethodsForm();
	public splitByResourcesForm = new SplitByResourcesForm();
	public splitByQuantityForm = new SplitByQuantityForm();
}