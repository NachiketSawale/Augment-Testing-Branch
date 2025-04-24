/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFormulaTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFormulaTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFormulaTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFormulaTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/formulatype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3a7cff1a4c644a089948e582c310a0d1',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeFormulaTypeEntity) => x.DescriptionInfo),
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
