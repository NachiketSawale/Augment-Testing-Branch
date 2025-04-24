/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportRequisitionStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportRequisitionStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportRequisitionStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportRequisitionStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportrequisitionstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bd07fed9f4c540cc80a27b63cdf238ae',
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'IsAccepted',
						model: 'IsAccepted',
						type: FieldType.Boolean,
						label: { text: 'IsAccepted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDeletable',
						model: 'IsDeletable',
						type: FieldType.Boolean,
						label: { text: 'IsDeletable' },
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
						id: 'Userflag1',
						model: 'Userflag1',
						type: FieldType.Boolean,
						label: { text: 'Userflag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag2',
						model: 'Userflag2',
						type: FieldType.Boolean,
						label: { text: 'Userflag2' },
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
						id: 'IsPlanningAllowed',
						model: 'IsPlanningAllowed',
						type: FieldType.Boolean,
						label: { text: 'IsPlanningAllowed' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
