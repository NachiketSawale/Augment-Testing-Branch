/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeItwoBaselineServerEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeItwoBaselineServerEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedItwoBaselineServerLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeItwoBaselineServerEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/itwobaselineserver/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7d46765e930246fc8d13caadcdeb82f6',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeItwoBaselineServerEntity) => x.DescriptionInfo),
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
						id: 'Url',
						model: 'Url',
						type: FieldType.Remark,
						label: { text: 'Url' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UrlUser',
						model: 'UrlUser',
						type: FieldType.Comment,
						label: { text: 'UrlUser' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UrlPassword',
						model: 'UrlPassword',
						type: FieldType.Quantity,
						label: { text: 'UrlPassword' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EncryptiontypeFk',
						model: 'EncryptiontypeFk',
						type: FieldType.Quantity,
						label: { text: 'EncryptiontypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
