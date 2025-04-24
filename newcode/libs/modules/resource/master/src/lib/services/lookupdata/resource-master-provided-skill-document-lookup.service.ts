import { RESOURCE_MASTER_PROVIDED_SKILL_DOCUMENT_ENTITY_INFO } from '../../model/resource-master-provided-skill-document-entity-info.model';
import { Injectable } from '@angular/core';
import { IResourceMasterProvidedSkillDocumentEntity } from '@libs/resource/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ResourceMasterProvidedSkillDocumentLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IResourceMasterProvidedSkillDocumentEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'resource/master/providedskilldocument',
					endPointRead: 'listbyparent'
				}
			},
			{
				uuid: 'c58ef79b72cd4de0a1a81c04d9a55822',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<IResourceMasterProvidedSkillDocumentEntity>>{
						columns: await RESOURCE_MASTER_PROVIDED_SKILL_DOCUMENT_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}