/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductionSetStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductionSetStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductionSetStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductionSetStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductionsetstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a1241c2d8ea04b8eacab7e252b9945c5',
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
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
						id: 'Isdeletable',
						model: 'Isdeletable',
						type: FieldType.Boolean,
						label: { text: 'Isdeletable' },
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
						id: 'IsDone',
						model: 'IsDone',
						type: FieldType.Boolean,
						label: { text: 'IsDone' },
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
						id: 'IsNesting',
						model: 'IsNesting',
						type: FieldType.Boolean,
						label: { text: 'IsNesting' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsNested',
						model: 'IsNested',
						type: FieldType.Boolean,
						label: { text: 'IsNested' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsLockedDate',
						model: 'IsLockedDate',
						type: FieldType.Boolean,
						label: { text: 'IsLockedDate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAssigned',
						model: 'IsAssigned',
						type: FieldType.Boolean,
						label: { text: 'IsAssigned' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsLockedQty',
						model: 'IsLockedQty',
						type: FieldType.Boolean,
						label: { text: 'IsLockedQty' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsLockedDateAndQty',
						model: 'IsLockedDateAndQty',
						type: FieldType.Boolean,
						label: { text: 'IsLockedDateAndQty' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
