/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEngDrawingEntityGenerated } from './eng-drawing-entity-generated.interface';

export interface IEngStack2ProdDescEntityGenerated extends IEntityBase {

	/*
	 * DbId
	 */
	DbId?: number | null;

	/*
	 * EngDrawingEntity
	 */
	EngDrawingEntity?: IEngDrawingEntityGenerated | null;

	/*
	 * EngDrawingFk
	 */
	EngDrawingFk?: number | null;

	/*
	 * EngStackFk
	 */
	EngStackFk?: number | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * InProduction
	 */
	InProduction?: boolean | null;

	/*
	 * InstallSequence
	 */
	InstallSequence?: number | null;

	/*
	 * Level
	 */
	Level?: number | null;

	/*
	 * Number4Plan
	 */
	Number4Plan?: number | null;

	/*
	 * Number4Stack
	 */
	Number4Stack?: number | null;

	/*
	 * PositionC
	 */
	PositionC?: number | null;

	/*
	 * PositionX
	 */
	PositionX?: number | null;

	/*
	 * PositionY
	 */
	PositionY?: number | null;

	/*
	 * PositionZ
	 */
	PositionZ?: number | null;

	/*
	 * PpsProductFk
	 */
	PpsProductFk?: number | null;

	/*
	 * PpsProductdescriptionFk
	 */
	PpsProductdescriptionFk?: number | null;

	/*
	 * Sequence
	 */
	Sequence?: number | null;
}
