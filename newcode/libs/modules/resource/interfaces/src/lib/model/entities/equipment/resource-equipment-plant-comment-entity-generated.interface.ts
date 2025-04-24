/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantCommentEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantCommentFk?: number | null;
	 PlantFk: number;
	 Specification?: number | null;
	 ClerkFk?: number | null;
}