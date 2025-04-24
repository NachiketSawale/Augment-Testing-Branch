/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantMeteringEvaluationEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantComponentFk: number;
	 PlantFk: number;
	 Recorded: number;
	 Quantity: number;
}