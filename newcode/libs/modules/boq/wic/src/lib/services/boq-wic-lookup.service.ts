/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWicGroupEntity } from '../model/entities/wic-group-entity.interface';

@Injectable({providedIn: 'root'})
export class BoqWicGroupLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IWicGroupEntity, TEntity> {

	public constructor() {
		super({
			httpRead: {
				route: 'boq/wic/group/',
				endPointRead: 'tree'
			},
			dataProcessors: [{
				processItem: (wicGroup) => {
					wicGroup.WicGroups ? wicGroup.WicGroups : [];
				}
			}],
		},
		{
			uuid: 'f3f12ede77f94394a9fbb6009dbf627c',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			descriptionMember: 'DescriptionInfo.Translated',
			showDescription: true,
			gridConfig: {
				uuid: 'f3f12ede77f94394a9fbb6009dbf627c',
				columns: [{
					id: 'Code',
					model: 'Code',
					type: FieldType.Code,
					label: 'cloud.common.entityCode',
					sortable: true
				},
				{
					id: 'description',
					model: 'DescriptionInfo.Translated',
					type: FieldType.Description,
					label: 'cloud.common.entityDescription',
					sortable: true
				}]
			},
			treeConfig: {
				parentMember: 'WicGroupFk',
				childMember: 'WicGroups'
			}
		});
	}
}