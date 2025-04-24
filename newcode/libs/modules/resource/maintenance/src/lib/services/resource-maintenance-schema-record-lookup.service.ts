import { RESOURCE_MAINTENANCE_SCHEMA_RECORD_ENTITY_INFO } from '../model/resource-maintenance-schema-record-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceMaintenanceSchemaRecordEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceMaintenanceSchemaRecordLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceMaintenanceSchemaRecordEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/maintenance/record',
					endPointRead: 'listByParent'
				}
			},
			{
				uuid: '',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceMaintenanceSchemaRecordEntity>>{
						columns: await RESOURCE_MAINTENANCE_SCHEMA_RECORD_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}