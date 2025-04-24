/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeConstraintTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeConstraintTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedConstraintTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeConstraintTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/constrainttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '26fffbeb8512482ca7857ef7b08b8d2a',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeConstraintTypeEntity) => x.DescriptionInfo),
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
