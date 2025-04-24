/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeExternalSourceEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeExternalSourceEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedExternalSourceLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeExternalSourceEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/externalsource/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd96019708fd944eeb419edda23d2bfed',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeExternalSourceEntity) => x.DescriptionInfo),
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
						id: 'ExternalsourcetypeFk',
						model: 'ExternalsourcetypeFk',
						type: FieldType.Quantity,
						label: { text: 'ExternalsourcetypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ExternalconfigFk',
						model: 'ExternalconfigFk',
						type: FieldType.Quantity,
						label: { text: 'ExternalconfigFk' },
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
