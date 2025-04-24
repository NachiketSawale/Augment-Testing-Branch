/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRequestForInfo2DefectTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRequestForInfo2DefectTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRequestForInfo2DefectTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRequestForInfo2DefectTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/requestforinfo2defecttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2c98a4f0df1c48db868d18bf78e9be8d',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRequestForInfo2DefectTypeEntity) => x.DescriptionInfo),
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
