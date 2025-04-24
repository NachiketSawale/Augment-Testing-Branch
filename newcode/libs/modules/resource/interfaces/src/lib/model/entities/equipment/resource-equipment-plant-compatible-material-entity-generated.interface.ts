/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantCompatibleMaterialEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 PlantComponentFk?: number | null;
	 MaterialCatalogFk: number;
	 MaterialFk: number;
	 CommentText?: string | null;
}