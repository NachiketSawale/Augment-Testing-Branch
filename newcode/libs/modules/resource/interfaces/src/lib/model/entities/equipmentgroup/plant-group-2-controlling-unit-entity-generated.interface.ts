/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IPlantGroup2ControllingUnitEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk: number;
	 ProjectContextFk: number;
	 ProjectFk?: number;
	 ControllingUnitFk: number;
	 Comment?: string;
}