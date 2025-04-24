/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePriceConditionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePriceConditionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPriceConditionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePriceConditionTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/priceconditiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '86ac8687d38a41deadd3d4e0981629c3',
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
						id: 'Value',
						model: 'Value',
						type: FieldType.Quantity,
						label: { text: 'Value' },
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
						id: 'HasValue',
						model: 'HasValue',
						type: FieldType.Boolean,
						label: { text: 'HasValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasTotal',
						model: 'HasTotal',
						type: FieldType.Boolean,
						label: { text: 'HasTotal' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPriceComponent',
						model: 'IsPriceComponent',
						type: FieldType.Boolean,
						label: { text: 'IsPriceComponent' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPrinted',
						model: 'IsPrinted',
						type: FieldType.Boolean,
						label: { text: 'IsPrinted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBold',
						model: 'IsBold',
						type: FieldType.Boolean,
						label: { text: 'IsBold' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Formula',
						model: 'Formula',
						type: FieldType.Remark,
						label: { text: 'Formula' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsShowInTicketSystem',
						model: 'IsShowInTicketSystem',
						type: FieldType.Boolean,
						label: { text: 'IsShowInTicketSystem' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FormulaDate',
						model: 'FormulaDate',
						type: FieldType.Remark,
						label: { text: 'FormulaDate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined1',
						model: 'UserDefined1',
						type: FieldType.Description,
						label: { text: 'UserDefined1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined2',
						model: 'UserDefined2',
						type: FieldType.Description,
						label: { text: 'UserDefined2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined3',
						model: 'UserDefined3',
						type: FieldType.Description,
						label: { text: 'UserDefined3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined4',
						model: 'UserDefined4',
						type: FieldType.Description,
						label: { text: 'UserDefined4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined5',
						model: 'UserDefined5',
						type: FieldType.Description,
						label: { text: 'UserDefined5' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
