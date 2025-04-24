/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IGridConfiguration, ILookupSearchRequest, ILookupTreeConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ProjectLocationLookupService<IEntity extends object> extends UiCommonLookupEndpointDataService <IProjectLocationEntity, IEntity>{
	public configuration!: IGridConfiguration<IProjectLocationEntity>;
	public constructor(){
		super(
			{
				httpRead: { route: 'project/location/', endPointRead: 'tree' },
				dataProcessors: [
					{
						processItem: (item) => {
							if (item.HasChildren) {
								item.image = item.isFilter ? 'ico-location-group-filter' : 'ico-location-group';
							} else {
								item.image = item.isFilter ? 'ico-location-filter' : 'ico-location2';
							}
						},
					},
				],
				filterParam: 'projectId',
				prepareListFilter: (context) => {
					const tempEntity = context?.entity as IProjectLocationEntity;
					return 'projectId=' + (tempEntity.ProjectId || tempEntity.ProjectFk);
				},
				tree: {
					parentProp: 'LocationParentFk',
					childProp: 'Locations',
				},
			},
			{
				uuid: 'b7872df0cbb5464f900237bc32486e5c',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				gridConfig: <IGridConfiguration<IProjectLocationEntity>>{
					treeConfiguration: {
						parent: (entity) => {
							if (entity.LocationParentFk) {
								return this.configuration?.items?.find((item) => item.Id === entity.LocationParentFk) || null;
							}
							return null;
						},
						children: (entity) => entity.Locations ?? [],
						collapsed: true,
					},
					uuid: 'a4cc03885298406494178b513a0b8bcd',
					indicator: true,
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'Code', key: 'cloud.common.entityCode' },
							visible: true,
							readonly: true,
							sortable: true,
							width: 100,
						},
						{
							id: 'Description',
							model: 'DescriptionInfo.Description',
							type: FieldType.Description,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							visible: true,
							readonly: true,
							sortable: true,
							width: 100,
						},
					],
				},
				dialogOptions: {
					headerText: {
						text: 'Structure',
					},
				},
				treeConfig: <ILookupTreeConfig<IProjectLocationEntity>>{
					parentMember: 'LocationParentFk',
					childMember: 'Locations',
				},
				showDialog: true,
			},
		);
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const projectId = get(request.additionalParameters, 'ProjectId');
			return 'projectId=' + projectId;
	}
}

