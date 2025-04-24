/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlant2ClerkEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 ClerkRoleFk: number;
	 ClerkFk: number;
	 ValidFrom?: Date | null;
	 ValidTo?: Date | null;
	 CommentText?: string | null;
}