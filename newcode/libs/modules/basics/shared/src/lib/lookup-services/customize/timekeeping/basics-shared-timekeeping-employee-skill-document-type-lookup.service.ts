/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeSkillDocumentTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeSkillDocumentTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeSkillDocumentTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeSkillDocumentTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeeskilldocumenttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '29983f8864324a9ea679522422407da2',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimekeepingEmployeeSkillDocumentTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
