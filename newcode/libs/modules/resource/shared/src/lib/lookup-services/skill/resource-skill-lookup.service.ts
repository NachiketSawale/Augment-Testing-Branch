/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, LookupContext, UiCommonLookupEndpointDataService, UiCommonLookupInputComponent } from '@libs/ui/common';
import { IResourceSkillEntity } from '@libs/resource/interfaces';
import { Injectable } from '@angular/core';



/**
 * Resource Skill Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceSkillLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IResourceSkillEntity, TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'resource/skill/', endPointRead: 'byrestype' },
			dataProcessors : [],
			filterParam: 'parentResTypeId',
			prepareListFilter : function (request) {
				const isNil = (val: unknown ) => val === undefined || val === null;
				const requestedId = ((request as LookupContext<IResourceSkillEntity,TEntity>)?.lookupInput as UiCommonLookupInputComponent<IResourceSkillEntity,TEntity, number>)?.value;
				return 'parentResTypeId=' + (!isNil(requestedId) ? requestedId.toString() : '-1');
			}

		}, {
			uuid: 'f4341c6fa21b412587468fd0c14ca8ab',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			gridConfig: {
				uuid: 'a4cc03889298406495178b513a0b8ead',
				columns: [
					{
						id: 'Description',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Translation,
						width: 300,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true
					},
				]
			},
		});
	}
}