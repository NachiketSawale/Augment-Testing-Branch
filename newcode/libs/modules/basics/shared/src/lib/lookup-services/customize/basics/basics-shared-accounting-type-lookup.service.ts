/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountingTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountingTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountingTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountingTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/accountingtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '800708c0fd7d47f0918aee5a3c323b0b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeAccountingTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
