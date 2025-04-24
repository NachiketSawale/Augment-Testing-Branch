/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringAccountingRuleTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringAccountingRuleTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringAccountingRuleTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringAccountingRuleTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/engineeringaccountingruletype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd533709705ad4fbda9ae67c182018ab2',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEngineeringAccountingRuleTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
