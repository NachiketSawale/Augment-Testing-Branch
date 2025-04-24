import { RESOURCE_EQUIPMENT_MAINTENANCE_ENTITY_INFO } from '../../model/resource-equipment-maintenance-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceEquipmentMaintenanceEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentMaintenanceLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceEquipmentMaintenanceEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/equipment/plantmaintenance',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: '55c7b2e5358042d48df6c049d2a3009a',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceEquipmentMaintenanceEntity>>{
						columns: await RESOURCE_EQUIPMENT_MAINTENANCE_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}