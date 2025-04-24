/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeCertificateStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeCertificateStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeCertificateStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeCertificateStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeecertificatestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4b862cb5c8184370a6d5bd6f64242f9a',
			valueMember: 'Id',
			displayMember: 'EmployeeCertificateStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'EmployeeCertificateStatusFk',
						model: 'EmployeeCertificateStatusFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeCertificateStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EmployeeCertificateStatusTargetFk',
						model: 'EmployeeCertificateStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'EmployeeCertificateStatusTargetFk' },
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
