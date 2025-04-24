/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEngDrawingComponentEntityGenerated } from './eng-drawing-component-entity-generated.interface';
import { IEngStack2ProdDescEntityGenerated } from './eng-stack-2prod-desc-entity-generated.interface';
import { IEngStackEntityGenerated } from './eng-stack-entity-generated.interface';

export interface IEngDrawingEntityGenerated extends IEntityBase {

	/*
	 * BasClerkFk
	 */
	BasClerkFk?: number | null;

	/*
	 * BasClobsFk
	 */
	BasClobsFk?: number | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * DocState
	 */
	DocState?: boolean | null;

	/*
	 * DynamicClerks
	 */
	DynamicClerks?: { [key: string]: number } | null;

	/*
	 * EngDrawingComponentEntities
	 */
	EngDrawingComponentEntities?: IEngDrawingComponentEntityGenerated[] | null;

	/*
	 * EngDrawingFk
	 */
	EngDrawingFk?: number | null;

	/*
	 * EngDrawingStatusFk
	 */
	EngDrawingStatusFk?: number | null;

	/*
	 * EngDrawingTypeFk
	 */
	EngDrawingTypeFk?: number | null;

	/*
	 * EngDrwRevisionFk
	 */
	EngDrwRevisionFk?: number | null;

	/*
	 * EngStack2ProdDescEntities
	 */
	EngStack2ProdDescEntities?: IEngStack2ProdDescEntityGenerated[] | null;

	/*
	 * EngStackEntities
	 */
	EngStackEntities?: IEngStackEntityGenerated[] | null;

	/*
	 * Entity2ClerkEntities
	 */
	//TODO: Entity2ClerkEntities?: IIEntity2ClerkEntity[] | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsFullyAccounted
	 */
	IsFullyAccounted?: boolean | null;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * LgmJobFk
	 */
	LgmJobFk?: number | null;

	/*
	 * MdcControllingunitFk
	 */
	MdcControllingunitFk?: number | null;

	/*
	 * PpsItemFk
	 */
	PpsItemFk?: number | null;

	/*
	 * PrjLocationFk
	 */
	PrjLocationFk?: number | null;

	/*
	 * PrjProjectFk
	 */
	PrjProjectFk?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined10
	 */
	UserDefined10?: string | null;

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

	/*
	 * UserDefined6
	 */
	UserDefined6?: string | null;

	/*
	 * UserDefined7
	 */
	UserDefined7?: string | null;

	/*
	 * UserDefined8
	 */
	UserDefined8?: string | null;

	/*
	 * UserDefined9
	 */
	UserDefined9?: string | null;
}
