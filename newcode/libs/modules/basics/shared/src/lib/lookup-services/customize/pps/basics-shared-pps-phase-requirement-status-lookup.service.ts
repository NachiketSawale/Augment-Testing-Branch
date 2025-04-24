/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsPhaseRequirementStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsPhaseRequirementStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsPhaseRequirementStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsPhaseRequirementStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsphaserequirementstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3d4f4ef4d3ec44fe903b07252d15823e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsPhaseRequirementStatusEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'IsFullySpecified',
						model: 'IsFullySpecified',
						type: FieldType.Boolean,
						label: { text: 'IsFullySpecified' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDone',
						model: 'IsDone',
						type: FieldType.Boolean,
						label: { text: 'IsDone' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserFlag1',
						model: 'UserFlag1',
						type: FieldType.Boolean,
						label: { text: 'UserFlag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserFlag2',
						model: 'UserFlag2',
						type: FieldType.Boolean,
						label: { text: 'UserFlag2' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
