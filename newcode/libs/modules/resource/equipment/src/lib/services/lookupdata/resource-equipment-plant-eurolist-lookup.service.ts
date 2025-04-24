import { RESOURCE_EQUIPMENT_PLANT_EUROLIST_ENTITY_INFO } from '../../model/resource-equipment-plant-eurolist-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantEurolistEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantEurolistLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentPlantEurolistEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/planteurolist',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: '25ce902f3f2240e8a5fd80c1e3a96118',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentPlantEurolistEntity>>{
						columns: await RESOURCE_EQUIPMENT_PLANT_EUROLIST_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}