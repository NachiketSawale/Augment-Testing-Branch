/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantFixedAssetEntityInfoGenerated } from './generated/resource-equipment-plant-fixed-asset-entity-info-generated.model';
import { IResourceEquipmentPlantFixedAssetEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantFixedAssetEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantFixedAssetEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_FIXED_ASSET_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantFixedAssetEntityInfoGenerated,resourceEquipmentPlantFixedAssetEntityInfo));