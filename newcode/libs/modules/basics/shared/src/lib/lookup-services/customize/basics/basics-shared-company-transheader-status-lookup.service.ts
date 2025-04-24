/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCompanyTransheaderStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCompanyTransheaderStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCompanyTransheaderStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCompanyTransheaderStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/companytransheaderstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd81f5df90d254976a4b51df95d5185de',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCompanyTransheaderStatusEntity) => x.DescriptionInfo),
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadyForAccounting',
						model: 'IsReadyForAccounting',
						type: FieldType.Boolean,
						label: { text: 'IsReadyForAccounting' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
