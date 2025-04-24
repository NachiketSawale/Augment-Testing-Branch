/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantAssignmentEntityGenerated extends IEntityIdentification, IEntityBase {
	 Description?: string | null;
	 PlantFk: number;
	 Plant2Fk: number;
	 Quantity: number;
	 UomFk: number;
	 CommentText?: string | null;
}