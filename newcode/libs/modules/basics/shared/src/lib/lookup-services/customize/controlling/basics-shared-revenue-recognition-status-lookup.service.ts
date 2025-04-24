/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRevenueRecognitionStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRevenueRecognitionStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRevenueRecognitionStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRevenueRecognitionStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/revenuerecognitionstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ee23a43b4cc044898e639ef55705bdd9',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Quantity,
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isreported',
						model: 'Isreported',
						type: FieldType.Boolean,
						label: { text: 'Isreported' },
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
