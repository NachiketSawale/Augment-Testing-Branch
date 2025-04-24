/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDispatchStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDispatchStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDispatchStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDispatchStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/dispatchstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '436a2f2059604659924446ad3fef611c',
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
						id: 'IsPlanned',
						model: 'IsPlanned',
						type: FieldType.Boolean,
						label: { text: 'IsPlanned' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsStarted',
						model: 'IsStarted',
						type: FieldType.Boolean,
						label: { text: 'IsStarted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFinished',
						model: 'IsFinished',
						type: FieldType.Boolean,
						label: { text: 'IsFinished' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsStockPosted',
						model: 'IsStockPosted',
						type: FieldType.Boolean,
						label: { text: 'IsStockPosted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsInvoiced',
						model: 'IsInvoiced',
						type: FieldType.Boolean,
						label: { text: 'IsInvoiced' },
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadyForSettlement',
						model: 'IsReadyForSettlement',
						type: FieldType.Boolean,
						label: { text: 'IsReadyForSettlement' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsValidatingPerformingJob',
						model: 'IsValidatingPerformingJob',
						type: FieldType.Boolean,
						label: { text: 'IsValidatingPerformingJob' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ispicking',
						model: 'Ispicking',
						type: FieldType.Boolean,
						label: { text: 'Ispicking' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isloadinggoods',
						model: 'Isloadinggoods',
						type: FieldType.Boolean,
						label: { text: 'Isloadinggoods' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
