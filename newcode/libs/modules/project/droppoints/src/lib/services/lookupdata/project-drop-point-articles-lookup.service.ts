import { PROJECT_DROP_POINT_ARTICLES_ENTITY_INFO } from '../../model/project-drop-point-articles-entity-info.model';
import { Injectable } from '@angular/core';
import { IProjectDropPointArticlesEntity } from '@libs/project/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ProjectDropPointArticlesLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IProjectDropPointArticlesEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'project/droppoints/droppointarticles',
					endPointRead: 'listbyparent',
					usePostForRead: true
				}
			},
			{
				uuid: 'c95033faf8e94cac9573cfcac23d5cc9',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IProjectDropPointArticlesEntity>>{
						columns: await PROJECT_DROP_POINT_ARTICLES_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}