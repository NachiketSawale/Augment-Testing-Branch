/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { logisticPlantsupplierPlantSupplyItemEntityInfoGenerated } from './generated/logistic-plantsupplier-plant-supply-item-entity-info-generated.model';
import { ILogisticPlantsupplierPlantSupplyItemEntity } from '@libs/logistic/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const logisticPlantsupplierPlantSupplyItemEntityInfo = <Partial<IEntityInfo<ILogisticPlantsupplierPlantSupplyItemEntity>>>{};
export const LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLY_ITEM_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(logisticPlantsupplierPlantSupplyItemEntityInfoGenerated,logisticPlantsupplierPlantSupplyItemEntityInfo));