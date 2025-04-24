import { RESOURCE_EQUIPMENT_PLANT_ENTITY_INFO } from '../../model/resource-equipment-plant-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentPlantEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/plant',
					endPointRead: 'filtered',
					usePostForRead: true
				}
			},
			{
				uuid: 'ec9b62a5101143009ddef62ca9f3e81b',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentPlantEntity>>{
						columns: await RESOURCE_EQUIPMENT_PLANT_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}