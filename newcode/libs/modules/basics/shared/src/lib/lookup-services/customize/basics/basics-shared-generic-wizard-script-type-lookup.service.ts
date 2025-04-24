/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeGenericWizardScriptTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeGenericWizardScriptTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedGenericWizardScriptTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeGenericWizardScriptTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/genericwizardscripttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'dc48905b6d4046d185fcc0b347de6320',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeGenericWizardScriptTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Remark,
						label: { text: 'Remark' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
