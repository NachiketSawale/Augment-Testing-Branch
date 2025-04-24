/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWorkInProgressAccrualModeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWorkInProgressAccrualModeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWorkInProgressAccrualModeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWorkInProgressAccrualModeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/workinprogressaccrualmode/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cf21c18ee5684f9b8ad7b0543d50b6a8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeWorkInProgressAccrualModeEntity) => x.DescriptionInfo),
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
						id: 'Abbreviation',
						model: 'Abbreviation',
						type: FieldType.Code,
						label: { text: 'Abbreviation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
