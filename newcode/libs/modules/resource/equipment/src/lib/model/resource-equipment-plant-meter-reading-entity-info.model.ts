/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantMeterReadingEntityInfoGenerated } from './generated/resource-equipment-plant-meter-reading-entity-info-generated.model';
import { IResourceEquipmentPlantMeterReadingEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantMeterReadingEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantMeterReadingEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_METER_READING_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantMeterReadingEntityInfoGenerated,resourceEquipmentPlantMeterReadingEntityInfo));