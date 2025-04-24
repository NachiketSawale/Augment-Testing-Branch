/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInvoiceTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInvoiceTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInvoiceTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInvoiceTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/invoicetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5e6778419bbd45b394c426d06c056343',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeInvoiceTypeEntity) => x.DescriptionInfo),
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isprogress',
						model: 'Isprogress',
						type: FieldType.Boolean,
						label: { text: 'Isprogress' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Abbreviation',
						model: 'Abbreviation',
						type: FieldType.Description,
						label: { text: 'Abbreviation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Abbreviation2',
						model: 'Abbreviation2',
						type: FieldType.Code,
						label: { text: 'Abbreviation2' },
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
						id: 'Isdeferable',
						model: 'Isdeferable',
						type: FieldType.Boolean,
						label: { text: 'Isdeferable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Iscumulativetransaction',
						model: 'Iscumulativetransaction',
						type: FieldType.Boolean,
						label: { text: 'Iscumulativetransaction' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isficorrection',
						model: 'Isficorrection',
						type: FieldType.Boolean,
						label: { text: 'Isficorrection' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
