/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelAnnotationStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelAnnotationStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelAnnotationStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelAnnotationStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelannotationstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8e70b75740bf4c9894b89b417b6f4a4c',
			valueMember: 'Id',
			displayMember: 'AnnoStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'AnnoStatusRuleFk',
						model: 'AnnoStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'AnnoStatusRuleFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ClerkRoleFk',
						model: 'ClerkRoleFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkRoleFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
