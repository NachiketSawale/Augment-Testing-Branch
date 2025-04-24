import { RESOURCE_EQUIPMENT_PLANT_COMPONENT_ENTITY_INFO } from '../../model/resource-equipment-plant-component-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantComponentEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantComponentLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentPlantComponentEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/plantcomponent',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: 'ed506d36293f459b86d70fec6b1fb007',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentPlantComponentEntity>>{
						columns: await RESOURCE_EQUIPMENT_PLANT_COMPONENT_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}