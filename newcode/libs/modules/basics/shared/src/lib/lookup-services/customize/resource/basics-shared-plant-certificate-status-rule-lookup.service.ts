/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantCertificateStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantCertificateStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantCertificateStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantCertificateStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantcertificatestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'eb81ae6ed11e4015af618768e7c50bcd',
			valueMember: 'Id',
			displayMember: 'CertificateStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'CertificateStatusFk',
						model: 'CertificateStatusFk',
						type: FieldType.Quantity,
						label: { text: 'CertificateStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CertificateStatusTargetFk',
						model: 'CertificateStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'CertificateStatusTargetFk' },
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
