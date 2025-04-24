/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTextModuleTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTextModuleTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTextModuleTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTextModuleTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/textmoduletype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '45e8b90cbb2145e6992d4527942744b0',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTextModuleTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasRubric',
						model: 'HasRubric',
						type: FieldType.Boolean,
						label: { text: 'HasRubric' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasCompany',
						model: 'HasCompany',
						type: FieldType.Boolean,
						label: { text: 'HasCompany' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasRole',
						model: 'HasRole',
						type: FieldType.Boolean,
						label: { text: 'HasRole' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasClerk',
						model: 'HasClerk',
						type: FieldType.Boolean,
						label: { text: 'HasClerk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasPortalGrp',
						model: 'HasPortalGrp',
						type: FieldType.Boolean,
						label: { text: 'HasPortalGrp' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsGlobal',
						model: 'IsGlobal',
						type: FieldType.Boolean,
						label: { text: 'IsGlobal' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TextAreaFk',
						model: 'TextAreaFk',
						type: FieldType.Quantity,
						label: { text: 'TextAreaFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
