/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IProjectGroupLookupEntity } from '@libs/project/interfaces';

/**
 * Project group lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class ProjectGroupLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IProjectGroupLookupEntity, TEntity> {

	public constructor() {

		const config: ILookupConfig<IProjectGroupLookupEntity, TEntity> =
			{
				uuid: '6df7ca744ab64644b2f791b1ee3dc831',
				valueMember: 'Id',
				displayMember: 'Code',
				descriptionMember: 'DescriptionInfo.Translated',
				treeConfig:{
					parentMember: 'ProjectGroupFk',
					// Need to process data due to lack of children information from IProjectGroupLookupEntity
					parent: (entity: IProjectGroupLookupEntity) => {
						if (entity.ProjectGroupFk) {
							const items = this.syncService?.getListSync();
							if(items){
								return items.find((item) => item.Id === entity.ProjectGroupFk) ?? null;
							}
						}
						return null;
					},
					children: (entity: IProjectGroupLookupEntity) => {
						const items = this.syncService?.getListSync();
						if(items) {
							return items.filter((item) => item.ProjectGroupFk === entity.Id);
						}
						return [];
					}
				},
				gridConfig:{
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: {key: 'cloud.common.entityCode'},
							sortable: false,
							visible: true,
							readonly: true
						},
						{
							id: 'descriptioninfo',
							model: 'DescriptionInfo',
							type: FieldType.Description,
							label: {key: 'cloud.common.entityDescription'},
							sortable: false,
							visible: true,
							readonly: true,
							width: 300
						},
						{
							id: 'Comments',
							model: 'CommentText',
							type: FieldType.Comment,
							label: {key: 'cloud.common.entityComment'},
							sortable: false,
							visible: true,
							readonly: true,
							width: 150
						},
						{
							id: 'UncPath',
							model: 'UncPath',
							type: FieldType.Comment,
							label: {key: 'project.group.uncPath'},
							sortable: false,
							visible: true,
							readonly: true,
							width: 150
						}
					]
				},
			};

		super('projectgrouptree', config);
	}

}