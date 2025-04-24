/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeGenericWizardStepTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeGenericWizardStepTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedGenericWizardStepTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeGenericWizardStepTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/genericwizardsteptype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e7dcec794a654d74a0c3965654ef83d3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeGenericWizardStepTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
