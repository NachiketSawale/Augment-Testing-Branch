/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEngDrawingEntityGenerated } from '@libs/productionplanning/shared';

export interface IEngDrawingEntity extends IEngDrawingEntityGenerated {
	Id: number;

	PrjProjectFk: number;
}
