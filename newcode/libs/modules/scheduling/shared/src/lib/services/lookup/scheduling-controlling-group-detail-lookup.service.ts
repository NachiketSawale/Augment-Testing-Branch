/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCustomizeMdcControllingGroupDetailEntity } from '@libs/basics/interfaces';
@Injectable({
	providedIn: 'root'
})
export class SchedulingControllingGroupDetailLookup<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMdcControllingGroupDetailEntity, T> {

	public constructor() {
		super({httpRead: { route: 'controlling/structure/lookup/', endPointRead: 'controllinggroupdetail' }},
			{
				uuid: '3a51bf834b8649069172d23ec1ba35e2',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: {
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: {
								text: 'Code',
								key: 'cloud.common.entityCode'
							},
							visible: true,
							sortable: true,
							readonly: true
						},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {
								text: 'Description',
								key: 'cloud.common.entityDescription'
							},
							visible: true,
							sortable: false,
							readonly: true
						},
						{
							id: 'CommentText',
							model: 'CommentText',
							type: FieldType.Comment,
							label: {
								text: 'Comment Text',
								key: 'cloud.common.entityCommentText'
							},
							visible: true,
							sortable: false,
							readonly: true
						}
					]
				}
			});
	}
}