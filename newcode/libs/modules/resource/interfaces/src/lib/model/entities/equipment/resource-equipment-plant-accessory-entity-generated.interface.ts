/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantAccessoryEntityGenerated extends IEntityIdentification, IEntityBase {
	 AccessoryTypeFk: number;
	 PlantFk: number;
	 Plant2Fk: number;
	 CommentText?: string | null;
}