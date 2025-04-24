/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceEquipmentPlantCommentEntity } from '@libs/resource/interfaces';

export class ResourceEquipmentPlantCommentUpdate implements CompleteIdentification<IResourceEquipmentPlantCommentEntity> {
	public MainItemId: number = 0;
	public PlantComments: IResourceEquipmentPlantCommentEntity[] | null = [];
}