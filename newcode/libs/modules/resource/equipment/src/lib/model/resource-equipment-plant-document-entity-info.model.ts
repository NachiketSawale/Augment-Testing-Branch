/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantDocumentEntityInfoGenerated } from './generated/resource-equipment-plant-document-entity-info-generated.model';
import { IResourceEquipmentPlantDocumentEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentPlantDocumentEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantDocumentEntity>>>{};
export const RESOURCE_EQUIPMENT_PLANT_DOCUMENT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantDocumentEntityInfoGenerated,resourceEquipmentPlantDocumentEntityInfo));