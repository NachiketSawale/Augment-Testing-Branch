import { PROJECT_DROP_POINT_ENTITY_INFO } from '../../model/project-drop-point-entity-info.model';
import { Injectable } from '@angular/core';
import { IProjectDropPointEntity } from '@libs/project/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ProjectDropPointLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IProjectDropPointEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'project/droppoints/droppoint',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: '83afe50043b34a1fa7205528a39dd2c8',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IProjectDropPointEntity>>{
						columns: await PROJECT_DROP_POINT_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}