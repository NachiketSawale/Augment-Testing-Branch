import { RESOURCE_MAINTENANCE_SCHEMA_ENTITY_INFO } from '../model/resource-maintenance-schema-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceMaintenanceSchemaEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceMaintenanceSchemaLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceMaintenanceSchemaEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/maintenance/schema',
					endPointRead: 'listbycontext'
				}
			},
			{
				uuid: '218bd94f773f41368745da41df52aebd',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceMaintenanceSchemaEntity>>{
						columns: await RESOURCE_MAINTENANCE_SCHEMA_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}