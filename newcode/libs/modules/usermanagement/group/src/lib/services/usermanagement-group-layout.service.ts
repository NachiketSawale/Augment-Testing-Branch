/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IAccessGroupEntity } from '../model/entities/access-group-entity.interface';


/**
 * UserManagement Group layout service
 */
@Injectable({
	providedIn: 'root',
})
export class UsermanagementGroupLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IAccessGroupEntity>> {
		const basicFields: (keyof IAccessGroupEntity)[] = ['Name', 'Description', 'DomainSID', 'SynchronizeDate', 'Email'];

		return {
			groups: [
				{
					gid: 'default-group',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: basicFields,
				},
			],
			labels: {
				...prefixAllTranslationKeys('usermanagement.group.', {
					Name: {
						key: 'groupName',
					},
					Description: {
						key: 'groupDescription',
					},
					DomainSID: {
						key: 'groupDomainSID',
					},
					SynchronizeDate: {
						key: 'groupSynchronizeDate',
					},
					Email: {
						key: 'groupEmail',
					},
				}),
			},
			overloads: {
				Name: {
					readonly: true,
				},
				DomainSID: {
					readonly: true,
				},
				SynchronizeDate: {
					readonly: true,
				},
			},
		};
	}
}
