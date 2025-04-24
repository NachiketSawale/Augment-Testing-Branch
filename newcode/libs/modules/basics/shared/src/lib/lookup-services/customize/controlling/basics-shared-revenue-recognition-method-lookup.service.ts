/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRevenueRecognitionMethodEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRevenueRecognitionMethodEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRevenueRecognitionMethodLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRevenueRecognitionMethodEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/revenuerecognitionmethod/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '173ad5e0a3904e6381cd6bee978b9627',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRevenueRecognitionMethodEntity) => x.DescriptionInfo),
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
