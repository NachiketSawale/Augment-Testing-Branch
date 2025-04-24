/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IGridConfiguration, ILookupTreeConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IResourceTypeEntity } from '@libs/resource/interfaces';
import {Injectable} from '@angular/core';


/**
 * Resource Type Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceTypeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IResourceTypeEntity, TEntity> {
	public configuration!: IGridConfiguration<IResourceTypeEntity>;
	public constructor() {
		super({
			httpRead: { route: 'resource/type', endPointRead: 'tree' },
			dataProcessors : [],
			tree: {
				parentProp: 'ResourceTypeFk',
				childProp: 'SubResources'
			}
		}, {
			uuid: '28a933b4413a402a98ecc5137d9f980c',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			gridConfig: {
				uuid: 'a4cc03889298406495178b513a0b8ead',
				treeConfiguration: {
					parent: (entity) => {
						if (entity.ResourceTypeFk) {
							return this.configuration?.items?.find((item) => item.Id === entity.ResourceTypeFk) || null;
						}
						return null;
					},
					children: (entity) => entity.SubResources?? [],
					collapsed: true
				},
				columns: [
					{
						id: 'Specification',
						model: 'Specification',
						type: FieldType.Remark,
						label: {text: 'Specification', key: 'cloud.common.EntitySpec'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Description,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: {text: 'Comment', key: 'cloud.common.entityCommentText'},
						sortable: true,
						visible: true,
						readonly: true
					},
				]
			},
			treeConfig: <ILookupTreeConfig<IResourceTypeEntity>>{
				parentMember: 'ResourceTypeFk',
				childMember: 'SubResources',
			},
		});
	}
}