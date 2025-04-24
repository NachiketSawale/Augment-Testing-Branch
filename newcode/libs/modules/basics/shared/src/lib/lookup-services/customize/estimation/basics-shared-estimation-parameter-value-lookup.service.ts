/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstimationParameterValueEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstimationParameterValueEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstimationParameterValueLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstimationParameterValueEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/estimationparametervalue/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0292b47030bd4f5d87f0e3209ff2788f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstimationParameterValueEntity) => x.DescriptionInfo),
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
						id: 'ParameterFk',
						model: 'ParameterFk',
						type: FieldType.Quantity,
						label: { text: 'ParameterFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValueDetail',
						model: 'ValueDetail',
						type: FieldType.Comment,
						label: { text: 'ValueDetail' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Value',
						model: 'Value',
						type: FieldType.Quantity,
						label: { text: 'Value' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValueText',
						model: 'ValueText',
						type: FieldType.Comment,
						label: { text: 'ValueText' },
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
						id: 'ValueType',
						model: 'ValueType',
						type: FieldType.Quantity,
						label: { text: 'ValueType' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
