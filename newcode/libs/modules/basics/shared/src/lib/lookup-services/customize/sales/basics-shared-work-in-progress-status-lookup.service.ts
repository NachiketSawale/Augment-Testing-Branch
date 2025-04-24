/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWorkInProgressStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWorkInProgressStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWorkInProgressStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWorkInProgressStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/workinprogressstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '102063793d9d445bb9c6b0784670e8d0',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
						id: 'ReadOnly',
						model: 'ReadOnly',
						type: FieldType.Boolean,
						label: { text: 'ReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsOrdered01',
						model: 'IsOrdered01',
						type: FieldType.Boolean,
						label: { text: 'IsOrdered01' },
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
					},
					{
						id: 'IsProtected',
						model: 'IsProtected',
						type: FieldType.Boolean,
						label: { text: 'IsProtected' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAccrued',
						model: 'IsAccrued',
						type: FieldType.Boolean,
						label: { text: 'IsAccrued' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCanceled',
						model: 'IsCanceled',
						type: FieldType.Boolean,
						label: { text: 'IsCanceled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isaccepted',
						model: 'Isaccepted',
						type: FieldType.Boolean,
						label: { text: 'Isaccepted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRevenueRecognition',
						model: 'IsRevenueRecognition',
						type: FieldType.Boolean,
						label: { text: 'IsRevenueRecognition' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
