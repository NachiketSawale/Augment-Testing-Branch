/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlant2EstimatePriceListLineItemEntityInfoGenerated } from './generated/resource-equipment-plant-2-estimate-price-list-line-item-entity-info-generated.model';
import { IResourceEquipmentPlant2EstimatePriceListLineItemEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlant2EstimatePriceListLineItemEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlant2EstimatePriceListLineItemEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_2_ESTIMATE_PRICE_LIST_LINE_ITEM_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlant2EstimatePriceListLineItemEntityInfoGenerated,resourceEquipmentPlant2EstimatePriceListLineItemEntityInfo));