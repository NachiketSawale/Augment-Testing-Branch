/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantProcurementContractVEntityInfoGenerated } from './generated/resource-equipment-plant-procurement-contract-v-entity-info-generated.model';
import { IResourceEquipmentPlantProcurementContractVEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantProcurementContractVEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantProcurementContractVEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_PROCUREMENT_CONTRACT_V_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantProcurementContractVEntityInfoGenerated,resourceEquipmentPlantProcurementContractVEntityInfo));