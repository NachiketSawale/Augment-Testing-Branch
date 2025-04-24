/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentPlantEurolistEntityInfoGenerated } from './generated/resource-equipment-plant-eurolist-entity-info-generated.model';
import { IResourceEquipmentPlantEurolistEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ResourceEquipmentEurolistDragDropService } from '../services/drag-drop/resource-equipment-eurolist-drag-drop.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';

const resourceEquipmentPlantEurolistEntityInfo = <Partial<IEntityInfo<IResourceEquipmentPlantEurolistEntity>>>{
	dragDropService:  ctx => ctx.injector.get(ResourceEquipmentEurolistDragDropService),
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IResourceEquipmentPlantEurolistEntity>>{
			overloads: {
				CatalogFk: ResourceSharedLookupOverloadProvider.provideResourceCatalogLookupOverload(false),
				CatalogRecordFk: ResourceSharedLookupOverloadProvider.provideResourceCatalogRecordLookupOverload(false)
			}
		};
	}
};
export const RESOURCE_EQUIPMENT_PLANT_EUROLIST_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentPlantEurolistEntityInfoGenerated,resourceEquipmentPlantEurolistEntityInfo));