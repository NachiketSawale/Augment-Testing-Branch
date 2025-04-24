/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEngDrawingEntityGenerated } from './eng-drawing-entity-generated.interface';

export interface IEngStackEntityGenerated extends IEntityBase {

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * DbId
	 */
	DbId?: number | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * EngDrawingEntity
	 */
	EngDrawingEntity?: IEngDrawingEntityGenerated | null;

	/*
	 * EngDrawingFk
	 */
	EngDrawingFk?: number | null;

	/*
	 * Height
	 */
	Height?: number | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * Length
	 */
	Length?: number | null;

	/*
	 * ResTypeFk
	 */
	ResTypeFk?: number | null;

	/*
	 * Type
	 */
	Type?: string | null;

	/*
	 * UomHeightFk
	 */
	UomHeightFk?: number | null;

	/*
	 * UomLengthFk
	 */
	UomLengthFk?: number | null;

	/*
	 * UomWeightFk
	 */
	UomWeightFk?: number | null;

	/*
	 * UomWidthFk
	 */
	UomWidthFk?: number | null;

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

	/*
	 * Weight
	 */
	Weight?: number | null;

	/*
	 * Width
	 */
	Width?: number | null;
}
