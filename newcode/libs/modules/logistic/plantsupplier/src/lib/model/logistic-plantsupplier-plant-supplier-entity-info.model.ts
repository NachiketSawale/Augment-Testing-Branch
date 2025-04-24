/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { logisticPlantsupplierPlantSupplierEntityInfoGenerated } from './generated/logistic-plantsupplier-plant-supplier-entity-info-generated.model';
import { ILogisticPlantsupplierPlantSupplierEntity } from '@libs/logistic/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const logisticPlantsupplierPlantSupplierEntityInfo = <Partial<IEntityInfo<ILogisticPlantsupplierPlantSupplierEntity>>>{};
export const LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLIER_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(logisticPlantsupplierPlantSupplierEntityInfoGenerated,logisticPlantsupplierPlantSupplierEntityInfo));