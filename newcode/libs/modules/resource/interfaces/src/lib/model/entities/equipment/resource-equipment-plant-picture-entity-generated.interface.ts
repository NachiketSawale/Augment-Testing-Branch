/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantPictureEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 BlobsFk: number;
	 PictureDate?: Date | null;
	 CommentText?: string | null;
	 Sorting: number;
	 IsDefault: boolean;
	 IsHiddenInPublicApi: boolean;
}