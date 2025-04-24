/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantComponentMaintSchemaEntityInfoGenerated } from './generated/resource-equipment-plant-component-maint-schema-entity-info-generated.model';
import { IResourceEquipmentPlantComponentMaintSchemaEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantComponentMaintSchemaEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantComponentMaintSchemaEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_COMPONENT_MAINT_SCHEMA_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantComponentMaintSchemaEntityInfoGenerated,resourceEquipmentPlantComponentMaintSchemaEntityInfo));