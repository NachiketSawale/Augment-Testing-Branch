/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstParameterEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstParameterEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstParameterLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstParameterEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/estparameter/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8fb027b47a4f4860bbe3315b1b6ed791',
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
						id: 'ParametergroupFk',
						model: 'ParametergroupFk',
						type: FieldType.Quantity,
						label: { text: 'ParametergroupFk' },
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
						id: 'DefaultValue',
						model: 'DefaultValue',
						type: FieldType.Quantity,
						label: { text: 'DefaultValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Islookup',
						model: 'Islookup',
						type: FieldType.Boolean,
						label: { text: 'Islookup' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RuleParamValueFk',
						model: 'RuleParamValueFk',
						type: FieldType.Quantity,
						label: { text: 'RuleParamValueFk' },
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
						id: 'ParameterText',
						model: 'ParameterText',
						type: FieldType.Comment,
						label: { text: 'ParameterText' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ParamvaluetypeFk',
						model: 'ParamvaluetypeFk',
						type: FieldType.Quantity,
						label: { text: 'ParamvaluetypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
