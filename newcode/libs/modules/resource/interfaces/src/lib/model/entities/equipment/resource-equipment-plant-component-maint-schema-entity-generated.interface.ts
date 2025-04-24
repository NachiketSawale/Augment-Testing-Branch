/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantComponentMaintSchemaEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantComponentFk: number;
	 MaintSchemaFk: number;
	 Description?: string | null;
	 CommentText?: string | null;
	 ValidFrom?: Date | null;
	 ValidTo?: Date | null;
	 PlantFk: number;
}