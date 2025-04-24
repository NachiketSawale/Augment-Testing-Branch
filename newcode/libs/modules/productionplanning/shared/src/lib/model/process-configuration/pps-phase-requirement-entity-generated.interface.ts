/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsPhaseRequirementEntityGenerated extends IEntityBase {

	Id: number;
	PpsPhaseFk: number;
	PpsPhaseReqStatusFk: number;
	PpsUpstreamGoodsTypeFk: number;
	MdcMaterialFk?: number | null;
	PpsFormworkTypeFk?: number | null;
	PpsProcessTemplateFk?: number | null;
	Quantity: number;
	BasUomFk: number;
	CommentText?: number | null;
	PpsUpstreamTypeFk?: number | null;
	PpsItemFk?: number | null;
	PrcPackageFk?: number | null;
	PesItemFk?: number | null;
	PpsFormworkFk?: number | null;
	PpsProcessFk?: Date | null;
	UserDefined1: string | null;
	UserDefined2: string | null;
	UserDefined3: string | null;
	UserDefined4: string | null;
	UserDefined5: string | null;
	MdcCostCodeFk?: number | null;
	MdcCostCodeTtFk?: number | null;
	ActualQuantity: number;
	CorrectionQuantity: number;

}