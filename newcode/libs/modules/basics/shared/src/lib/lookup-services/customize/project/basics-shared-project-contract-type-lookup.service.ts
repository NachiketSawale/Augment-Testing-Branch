/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectContractTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectContractTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectContractTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectContractTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectcontracttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'aa24df0c7323419ca26213e60dc44871',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectContractTypeEntity) => x.DescriptionInfo),
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
						id: 'IsConsolidateChange',
						model: 'IsConsolidateChange',
						type: FieldType.Boolean,
						label: { text: 'IsConsolidateChange' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TransactionItemInc',
						model: 'TransactionItemInc',
						type: FieldType.Quantity,
						label: { text: 'TransactionItemInc' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
