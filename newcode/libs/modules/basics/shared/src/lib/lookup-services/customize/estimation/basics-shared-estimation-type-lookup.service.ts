/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstimationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstimationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstimationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstimationTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/estimationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd63af8fec1f642bd8ae6bd4764629e9b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstimationTypeEntity) => x.DescriptionInfo),
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBid',
						model: 'IsBid',
						type: FieldType.Boolean,
						label: { text: 'IsBid' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isjob',
						model: 'Isjob',
						type: FieldType.Boolean,
						label: { text: 'Isjob' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'GuidGrid',
						model: 'GuidGrid',
						type: FieldType.Quantity,
						label: { text: 'GuidGrid' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'GuidDetail',
						model: 'GuidDetail',
						type: FieldType.Quantity,
						label: { text: 'GuidDetail' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'GuidResGrid',
						model: 'GuidResGrid',
						type: FieldType.Quantity,
						label: { text: 'GuidResGrid' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'GuidResDetail',
						model: 'GuidResDetail',
						type: FieldType.Quantity,
						label: { text: 'GuidResDetail' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsTotalWq',
						model: 'IsTotalWq',
						type: FieldType.Boolean,
						label: { text: 'IsTotalWq' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsTotalAqBudget',
						model: 'IsTotalAqBudget',
						type: FieldType.Boolean,
						label: { text: 'IsTotalAqBudget' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsWqReadOnly',
						model: 'IsWqReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsWqReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isgc',
						model: 'Isgc',
						type: FieldType.Boolean,
						label: { text: 'Isgc' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBudgetEditable',
						model: 'IsBudgetEditable',
						type: FieldType.Boolean,
						label: { text: 'IsBudgetEditable' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
