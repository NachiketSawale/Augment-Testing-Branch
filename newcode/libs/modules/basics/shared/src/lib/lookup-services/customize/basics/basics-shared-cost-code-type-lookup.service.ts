/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCostCodeTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCostCodeTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCostCodeTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCostCodeTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/costcodetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '16e1d956e7fc418eb04386bf5d4b702f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCostCodeTypeEntity) => x.DescriptionInfo),
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
						id: 'IsEstimateCc',
						model: 'IsEstimateCc',
						type: FieldType.Boolean,
						label: { text: 'IsEstimateCc' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRevenueCc',
						model: 'IsRevenueCc',
						type: FieldType.Boolean,
						label: { text: 'IsRevenueCc' },
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
						id: 'IsMounting',
						model: 'IsMounting',
						type: FieldType.Boolean,
						label: { text: 'IsMounting' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAllowance',
						model: 'IsAllowance',
						type: FieldType.Boolean,
						label: { text: 'IsAllowance' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isrp',
						model: 'Isrp',
						type: FieldType.Boolean,
						label: { text: 'Isrp' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isga',
						model: 'Isga',
						type: FieldType.Boolean,
						label: { text: 'Isga' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isam',
						model: 'Isam',
						type: FieldType.Boolean,
						label: { text: 'Isam' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCommissioning',
						model: 'IsCommissioning',
						type: FieldType.Boolean,
						label: { text: 'IsCommissioning' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasOrder',
						model: 'HasOrder',
						type: FieldType.Boolean,
						label: { text: 'HasOrder' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsInformation',
						model: 'IsInformation',
						type: FieldType.Boolean,
						label: { text: 'IsInformation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
