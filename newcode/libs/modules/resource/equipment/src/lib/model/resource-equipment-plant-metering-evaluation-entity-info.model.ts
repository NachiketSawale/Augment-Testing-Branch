/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantMeteringEvaluationEntityInfoGenerated } from './generated/resource-equipment-plant-metering-evaluation-entity-info-generated.model';
import { IResourceEquipmentPlantMeteringEvaluationEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantMeteringEvaluationEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantMeteringEvaluationEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_METERING_EVALUATION_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantMeteringEvaluationEntityInfoGenerated,resourceEquipmentPlantMeteringEvaluationEntityInfo));