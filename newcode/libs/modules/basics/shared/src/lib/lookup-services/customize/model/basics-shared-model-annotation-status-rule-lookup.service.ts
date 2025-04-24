/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelAnnotationStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelAnnotationStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelAnnotationStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelAnnotationStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelannotationstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'dbf4a382df2e4b8c968708dbcafc9c74',
			valueMember: 'Id',
			displayMember: 'AnnoStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'AnnoStatusFk',
						model: 'AnnoStatusFk',
						type: FieldType.Quantity,
						label: { text: 'AnnoStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AnnoStatusTargetFk',
						model: 'AnnoStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'AnnoStatusTargetFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
