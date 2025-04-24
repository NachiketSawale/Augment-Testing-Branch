/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsItemFilterOptionsEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsItemFilterOptionsEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsItemFilterOptionsLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsItemFilterOptionsEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsitemfilteroptions/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'aa76788eb7cd405894e815f791741432',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsItemFilterOptionsEntity) => x.DescriptionInfo),
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
						id: 'JobFilter',
						model: 'JobFilter',
						type: FieldType.Boolean,
						label: { text: 'JobFilter' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FilterHierarchyFk',
						model: 'FilterHierarchyFk',
						type: FieldType.Quantity,
						label: { text: 'FilterHierarchyFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
