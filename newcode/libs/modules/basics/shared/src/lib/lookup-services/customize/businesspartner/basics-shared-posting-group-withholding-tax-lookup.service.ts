/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePostingGroupWithholdingTaxEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePostingGroupWithholdingTaxEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPostingGroupWithholdingTaxLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePostingGroupWithholdingTaxEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/postinggroupwithholdingtax/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ecf7cb5504ca47adb6facbad745d33f2',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePostingGroupWithholdingTaxEntity) => x.DescriptionInfo),
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
						id: 'SubledgerContextFk',
						model: 'SubledgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'SubledgerContextFk' },
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
						id: 'GroupFinance',
						model: 'GroupFinance',
						type: FieldType.Description,
						label: { text: 'GroupFinance' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
