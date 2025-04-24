/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeKeepingProfessionalCategoryEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeKeepingProfessionalCategoryEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeKeepingProfessionalCategoryLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeKeepingProfessionalCategoryEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timekeepingprofessionalcategory/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5062b8e08156417ab83aabe870d3624b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimeKeepingProfessionalCategoryEntity) => x.DescriptionInfo),
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
						id: 'TimesheetContextFk',
						model: 'TimesheetContextFk',
						type: FieldType.Quantity,
						label: { text: 'TimesheetContextFk' },
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
