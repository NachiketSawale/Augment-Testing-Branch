/*
 * Copyright(c) RIB Software GmbH
 */
import {  Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import {  prefixAllTranslationKeys } from '@libs/platform/common';

import { IAccessRoleEntity } from '../model/entities/access-role-entity.interface';
import { BasicsSharedFrmAccessRoleCategoryLookupService } from '@libs/basics/shared';

/**
 * Usermanagement Right Role Entity layout service
 */
@Injectable({
	providedIn: 'root',
})
export class UsermanagementRoleLayoutService {

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IAccessRoleEntity> {

		const basicFields: (keyof IAccessRoleEntity)[] = ['Name', 'Description', 'AccessRoleCategoryFk'];

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: basicFields
				}
			],
			labels: {
				...prefixAllTranslationKeys('usermanagement.right.', {
					'Name': {
						'key': 'rightName',
						'text': 'Name'
					},
					'Description': {
						'key': 'rightDescription',
						'text': 'Description'
					},
					'AccessRoleCategoryFk': {
						'key': 'accessRoleCategoryFk',
						'text': 'Category'
					},
				}),
			},
			overloads: {
				AccessRoleCategoryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedFrmAccessRoleCategoryLookupService,
						displayMember: 'Name',
					}),
					width: 250,
				}
			},
		};
	}
}