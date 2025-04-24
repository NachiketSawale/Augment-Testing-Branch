/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResRequisitionStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResRequisitionStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResRequisitionStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResRequisitionStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/resrequisitionstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ed88f62588944798a2bc3a01975204ba',
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BackgroundColor',
						model: 'BackgroundColor',
						type: FieldType.Quantity,
						label: { text: 'BackgroundColor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FontColor',
						model: 'FontColor',
						type: FieldType.Quantity,
						label: { text: 'FontColor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFullyCovered',
						model: 'IsFullyCovered',
						type: FieldType.Boolean,
						label: { text: 'IsFullyCovered' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsConfirmed',
						model: 'IsConfirmed',
						type: FieldType.Boolean,
						label: { text: 'IsConfirmed' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFullyReserved',
						model: 'IsFullyReserved',
						type: FieldType.Boolean,
						label: { text: 'IsFullyReserved' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReopened',
						model: 'IsReopened',
						type: FieldType.Boolean,
						label: { text: 'IsReopened' },
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
					}
				]
			}
		});
	}
}
