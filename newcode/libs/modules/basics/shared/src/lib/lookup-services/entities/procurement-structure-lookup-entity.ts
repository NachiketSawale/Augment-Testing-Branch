/*
 * Copyright(c) RIB Software GmbH
 */
import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

/**
 *  Procurement Structure
 */
export interface IProcurementStructureLookupEntity extends IEntityIdentification {
	/**
	 * Code
	 */
	Code: string;
	/**
	 * description info
	 */
	DescriptionInfo: IDescriptionInfo;
	/**
	 * CommentText info
	 */
	CommentTextInfo: IDescriptionInfo;
	/**
	 * TaxCodeFk
	 */
	TaxCodeFk?: number;

	PrcStructureFk?: number;
	AllowAssignment: boolean;
	HasChildren: boolean;
	ChildItems?: Array<IProcurementStructureLookupEntity>;
	PrcConfigHeaderFk?: number | null;
	MatrialCount: number;
	IsSelected: boolean | null;
	IsExistent: boolean;
	ChildCount: number;
	isAllowAsign: boolean;
	MdcContextFk: number | null;
	PrcStructureTypeFk: number;
	CostCodeFk: number | null;
	CostCodeURP1Fk: number | null;
	CostCodeURP2Fk: number | null;
	CostCodeURP3Fk: number | null;
	CostCodeURP4Fk: number | null;
	CostCodeURP5Fk: number | null;
	CostCodeURP6Fk: number | null;
	CostCodeVATFk: number | null;
	IsLive: boolean;
	IsFormalHandover: boolean;
	IsApprovalRequired: boolean;
	IsStockExcluded: boolean;
	PrcStructureLevel1Fk: number | null;
	PrcStructureLevel2Fk: number | null;
	PrcStructureLevel3Fk: number | null;
	PrcStructureLevel4Fk: number | null;
	PrcStructureLevel5Fk: number | null;
	ScurveFk: number | null;
	ClerkPrcFk: number | null;
	ClerkReqFk: number | null;
	BasLoadingCostId: number;
}
