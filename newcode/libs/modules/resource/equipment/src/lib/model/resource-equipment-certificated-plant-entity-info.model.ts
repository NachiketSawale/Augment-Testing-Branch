/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentCertificatedPlantEntityInfoGenerated } from './generated/resource-equipment-certificated-plant-entity-info-generated.model';
import { IResourceEquipmentCertificatedPlantEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentCertificatedPlantEntityInfo = <Partial<IEntityInfo<IResourceEquipmentCertificatedPlantEntity>>>{};
export const RESOURCE_EQUIPMENT_CERTIFICATED_PLANT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentCertificatedPlantEntityInfoGenerated,resourceEquipmentCertificatedPlantEntityInfo));