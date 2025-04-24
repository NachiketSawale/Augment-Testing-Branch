import { RESOURCE_MASTER_RESOURCE_ENTITY_INFO } from '../../model/resource-master-resource-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceMasterResourceEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceMasterResourceLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceMasterResourceEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/master/resource',
					endPointRead: 'filtered'
				}
			},
			{
				uuid: 'fbc4fc1572754656ab8903f59907e668',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceMasterResourceEntity>>{
						columns: await RESOURCE_MASTER_RESOURCE_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}