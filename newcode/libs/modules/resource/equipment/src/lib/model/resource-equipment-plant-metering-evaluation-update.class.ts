/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceEquipmentPlantMeteringEvaluationEntity } from '@libs/resource/interfaces';

export class ResourceEquipmentPlantMeteringEvaluationUpdate implements CompleteIdentification<IResourceEquipmentPlantMeteringEvaluationEntity> {
	public MainItemId: number = 0;
	public PlantMeteringEvaluations: IResourceEquipmentPlantMeteringEvaluationEntity[] | null = [];
}