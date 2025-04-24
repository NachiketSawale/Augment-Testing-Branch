/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDisplayDomainEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDisplayDomainEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDisplayDomainLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDisplayDomainEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/displaydomain/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c120aa232f80432094b905e6ddad9710',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDisplayDomainEntity) => x.DescriptionInfo),
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
						id: 'DomainName',
						model: 'DomainName',
						type: FieldType.Description,
						label: { text: 'DomainName' },
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
