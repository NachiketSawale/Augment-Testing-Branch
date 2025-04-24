/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantCertificateStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantCertificateStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantCertificateStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantCertificateStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantcertificatestatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2887130dd1df479381dd0e6d7aa763ee',
			valueMember: 'Id',
			displayMember: 'CertificateStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'CertificateStatusRuleFk',
						model: 'CertificateStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'CertificateStatusRuleFk' },
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
