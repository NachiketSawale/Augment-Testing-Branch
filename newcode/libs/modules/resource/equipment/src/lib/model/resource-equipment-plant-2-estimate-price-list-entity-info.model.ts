/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlant2EstimatePriceListEntityInfoGenerated } from './generated/resource-equipment-plant-2-estimate-price-list-entity-info-generated.model';
import { IResourceEquipmentPlant2EstimatePriceListEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlant2EstimatePriceListEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlant2EstimatePriceListEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_2_ESTIMATE_PRICE_LIST_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlant2EstimatePriceListEntityInfoGenerated,resourceEquipmentPlant2EstimatePriceListEntityInfo));