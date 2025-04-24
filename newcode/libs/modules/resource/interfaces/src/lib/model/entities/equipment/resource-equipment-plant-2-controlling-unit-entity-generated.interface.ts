/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlant2ControllingUnitEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 ProjectContextFk: number;
	 ProjectFk?: number | null;
	 ControllingUnitFk: number;
	 Comment?: string | null;
}