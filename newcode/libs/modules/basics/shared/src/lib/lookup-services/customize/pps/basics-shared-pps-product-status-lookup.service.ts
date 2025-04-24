/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '85437c7c06e44f259d803c3421e3f768',
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
						id: 'IsInProduction',
						model: 'IsInProduction',
						type: FieldType.Boolean,
						label: { text: 'IsInProduction' },
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
						id: 'IsProduced',
						model: 'IsProduced',
						type: FieldType.Boolean,
						label: { text: 'IsProduced' },
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
						id: 'IsShipped',
						model: 'IsShipped',
						type: FieldType.Boolean,
						label: { text: 'IsShipped' },
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
						id: 'IsScrap',
						model: 'IsScrap',
						type: FieldType.Boolean,
						label: { text: 'IsScrap' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadyForStockYard',
						model: 'IsReadyForStockYard',
						type: FieldType.Boolean,
						label: { text: 'IsReadyForStockYard' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAccounted',
						model: 'IsAccounted',
						type: FieldType.Boolean,
						label: { text: 'IsAccounted' },
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
						id: 'IsComponentRemoved',
						model: 'IsComponentRemoved',
						type: FieldType.Boolean,
						label: { text: 'IsComponentRemoved' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
