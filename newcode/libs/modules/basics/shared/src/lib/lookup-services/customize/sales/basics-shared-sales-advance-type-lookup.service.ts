/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSalesAdvanceTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSalesAdvanceTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSalesAdvanceTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSalesAdvanceTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/salesadvancetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2d9fd75c59d448c9bb33dcb1011527ee',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSalesAdvanceTypeEntity) => x.DescriptionInfo),
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
						id: 'LedgerContextFk',
						model: 'LedgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'LedgerContextFk' },
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
						id: 'Account1Fk',
						model: 'Account1Fk',
						type: FieldType.Quantity,
						label: { text: 'Account1Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Account2Fk',
						model: 'Account2Fk',
						type: FieldType.Quantity,
						label: { text: 'Account2Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TaxCodeFk',
						model: 'TaxCodeFk',
						type: FieldType.Quantity,
						label: { text: 'TaxCodeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined1',
						model: 'Userdefined1',
						type: FieldType.Description,
						label: { text: 'Userdefined1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined2',
						model: 'Userdefined2',
						type: FieldType.Description,
						label: { text: 'Userdefined2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined3',
						model: 'Userdefined3',
						type: FieldType.Description,
						label: { text: 'Userdefined3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined4',
						model: 'Userdefined4',
						type: FieldType.Description,
						label: { text: 'Userdefined4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined5',
						model: 'Userdefined5',
						type: FieldType.Description,
						label: { text: 'Userdefined5' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
