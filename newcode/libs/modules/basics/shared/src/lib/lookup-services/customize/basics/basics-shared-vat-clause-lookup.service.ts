/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeVatClauseEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeVatClauseEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedVatClauseLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeVatClauseEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/vatclause/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6a948c0ecade4ae9a4f439adac1bfd29',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeVatClauseEntity) => x.DescriptionInfo),
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
						id: 'CommentTextInfo',
						model: 'CommentTextInfo',
						type: FieldType.Translation,
						label: { text: 'CommentTextInfo' },
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
