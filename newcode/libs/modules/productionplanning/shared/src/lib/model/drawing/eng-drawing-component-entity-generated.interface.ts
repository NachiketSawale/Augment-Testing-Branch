/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEngDrawingEntityGenerated } from './eng-drawing-entity-generated.interface';

export interface IEngDrawingComponentEntityGenerated extends IEntityBase {
	/*
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * EngAccRulesetResultFk
	 */
	EngAccRulesetResultFk?: number | null;

	/*
	 * EngAccountingRuleFk
	 */
	EngAccountingRuleFk?: number | null;

	/*
	 * EngDrawingEntity
	 */
	EngDrawingEntity?: IEngDrawingEntityGenerated | null;

	/*
	 * EngDrawingFk
	 */
	EngDrawingFk?: number | null;

	/*
	 * EngDrwCompStatusFk
	 */
	EngDrwCompStatusFk?: number | null;

	/*
	 * EngDrwCompTypeFk
	 */
	EngDrwCompTypeFk?: number | null;

	/*
	 * EngDrwRevisionFk
	 */
	EngDrwRevisionFk?: number | null;

	/*
	 * EngTmplRevisionFk
	 */
	EngTmplRevisionFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * Isimported
	 */
	Isimported?: boolean | null;

	/*
	 * MdcCostCodeFk
	 */
	MdcCostCodeFk?: number | null;

	/*
	 * MdcMaterialCostCodeFk
	 */
	MdcMaterialCostCodeFk?: number | null;

	/*
	 * MdcMaterialFk
	 */
	MdcMaterialFk?: number | null;

	/*
	 * PpsProductdescriptionFk
	 */
	PpsProductdescriptionFk?: number | null;

	/*
	 * Quantity
	 */
	Quantity?: number | null;

	/*
	 * Quantity2
	 */
	Quantity2?: number | null;

	/*
	 * Quantity3
	 */
	Quantity3?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;

	/*
	 * Uom2Fk
	 */
	Uom2Fk?: number | null;

	/*
	 * Uom3Fk
	 */
	Uom3Fk?: number | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/*
	 * UserDefined5
	 */
	UserDefined5?: string | null;
}
