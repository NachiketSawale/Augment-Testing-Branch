/*
 * Copyright(c) RIB Software GmbH
 */
import { IDescriptionInfo } from '@libs/platform/common';

export interface IControllingProjectcontrolsCostAnalysisEntity {
	Id: number;

	ParentFk?: number;

	Count?: number;

	Code?: string;

	Description?: IDescriptionInfo | string;

	StructureIdId?: number;

	StructureParentId?: number;

	StructureLevel?: number;

	AnalysisItems?: Map<string, number>[];

	Children?: IControllingProjectcontrolsCostAnalysisEntity[];

	EditableInfo?: IGroupingItemEditableInfo;

	indColor?: string;

	IsMarked?: boolean;
}

export interface IGroupingItemEditableInfo {
	IsControllingUnitEditable: boolean;

	IsControllingUnitVisible: boolean;

	IsWCFBCFEditable: boolean;

	IsWCFBCFItem: boolean;

	ControllingUnitFk: number;

	ControllingUnitCostCodeFk: number;
}
