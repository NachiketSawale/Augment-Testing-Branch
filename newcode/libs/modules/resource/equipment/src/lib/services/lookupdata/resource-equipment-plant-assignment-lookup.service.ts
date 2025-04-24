import { RESOURCE_EQUIPMENT_PLANT_ASSIGNMENT_ENTITY_INFO } from '../../model/resource-equipment-plant-assignment-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentPlantAssignmentEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantAssignmentLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentPlantAssignmentEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/plantassignment',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: 'e263fc5d62b14522b24808ac4b43bd09',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentPlantAssignmentEntity>>{
						columns: await RESOURCE_EQUIPMENT_PLANT_ASSIGNMENT_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}